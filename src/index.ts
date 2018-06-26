import CrowdClient from "atlassian-crowd-client";
import Group from "atlassian-crowd-client/lib/models/group";
import { SlackBot, slackbot, SlackConfiguration, SlackController, SlackMessage, SlackSpawnConfiguration } from "botkit";
import { getLanguage, getLocale, Language } from "./locale";
import { log } from "./log";

enum EnvName {
    CROWDBOT_LANG = "CROWDBOT_LANG",
    CROWD_BASE_URL = "CROWD_BASE_URL",
    CROWD_APPLICATION = "CROWD_APPLICATION",
    CROWD_PASSWORD = "CROWD_PASSWORD",
    SLACK_BOT_TOKEN = "SLACK_BOT_TOKEN",
    SLACK_ADMIN_IDS = "SLACK_ADMIN_IDS",
}

const language: Language = getLanguage(process.env[EnvName.CROWDBOT_LANG]);

const locale = getLocale(language);

const getEnv = (name: EnvName, defaultValue?: string): string => {
    const value = process.env[name] || defaultValue;
    if (value) {
        return value;
    } else {
        log.error(locale.error.invalidEnvironmentVariable(name));
        throw new Error(locale.error.invalidEnvironmentVariable(name));
    }
};

const getSlackUserEmailAddress = (bot: SlackBot, userId: string): Promise<string> =>
    new Promise((resolve, reject) =>
        bot.api.users.info({ user: userId }, (err: Error, response: any) => {
            if (err) {
                reject(err);
            } else if (
                !response.ok ||
                !response.user ||
                !response.user.profile ||
                !response.user.profile.email ||
                typeof response.user.profile.email !== "string"
            ) {
                reject(locale.error.failedToGetSlackUserInfo);
            } else {
                resolve(response.user.profile.email);
            }
        }),
    );

const getCrowdUsernameByEmailAddress = (email: string): string | undefined => {
    const match = email.match(/(^[^@]+)@[^@]+$/);
    if (match) {
        return match[1];
    } else {
        return undefined;
    }
};

const crowdBaseUrl: string = getEnv(EnvName.CROWD_BASE_URL);
const crowdAppName: string = getEnv(EnvName.CROWD_APPLICATION);
const crowdAppPassword: string = getEnv(EnvName.CROWD_PASSWORD);
const slackBotToken: string = getEnv(EnvName.SLACK_BOT_TOKEN);
const slackAdminIds: ReadonlyArray<string> = getEnv(EnvName.SLACK_ADMIN_IDS, "").split(",");

const crowd = new CrowdClient({
    baseUrl: crowdBaseUrl,
    application: {
        name: crowdAppName,
        password: crowdAppPassword,
    },
    debug: true,
});

const configuration: SlackConfiguration = {
    scopes: ["bot"],
    retry: Infinity,
};

const controller: SlackController = slackbot(configuration);

controller.hears(/^(help)?$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    bot.reply(message, locale.slack.help);
});

controller.hears(/^list$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    getSlackUserEmailAddress(bot, message.user!).then(
        email => {
            log.debug(`user email: ${email}`);
            const username: string | undefined = getCrowdUsernameByEmailAddress(email);
            if (!username) {
                bot.reply(message, locale.error.failedToGetSlackUserInfo);
                log.warn(locale.error.invalidEmailAddressFormat(email));
            } else {
                crowd.user.groups
                    .list(username)
                    .then(groups => {
                        log.debug(`user: ${username}, groups: ${groups}`);
                        if (groups.length === 0) {
                            bot.reply(message, locale.slack.noGroup);
                        } else {
                            bot.reply(message, `${locale.slack.groupList} ${groups.join(", ")}`);
                        }
                    })
                    .catch(error => {
                        bot.reply(message, locale.error.errorCrowdApi);
                        log.warn(`${locale.error.errorCrowdApi}: ${error}`);
                    });
            }
        },
        reason => {
            bot.reply(message, locale.error.failedToGetSlackUserInfo);
            log.warn(`${locale.error.failedToGetSlackUserInfo}: ${reason}`);
        },
    );
});

controller.hears(/^list\s+(\S+)$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    const groupname: string = message.match![1];
    crowd.group.users
        .list(groupname)
        .then(users => {
            log.debug(`groupname: ${groupname}, users: ${users}`);
            if (users.length === 0) {
                bot.reply(message, locale.slack.noUser(groupname));
            } else {
                bot.reply(message, `${locale.slack.userList(groupname)} ${users.join(", ")}`);
            }
        })
        .catch(error => {
            log.info(`group.users.list returns error: ${JSON.stringify(error)}`);
            if (error.type === "GROUP_NOT_FOUND") {
                bot.reply(message, locale.error.noGroupExists(groupname));
            } else {
                bot.reply(message, locale.error.errorCrowdApi);
                log.warn(`${locale.error.errorCrowdApi}: ${error}`);
            }
        });
});

controller.hears(/^create\s+(\S+)$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    const groupname: string = message.match![1];
    const group: Group = new Group(groupname);

    if (!slackAdminIds.includes(message.user!)) {
        log.info(`${locale.error.noAuthToAddUserToGroup}. user: ${message.user}`);
        bot.reply(message, locale.error.noAuthToAddUserToGroup);
        return;
    }
    crowd.group
        .create(group)
        .then(() => {
            bot.reply(message, locale.crowd.createGroup);
        })
        .catch(error => {
            log.info(error);
            bot.reply(message, locale.error.errorCrowdApi);
        });
});

controller.hears(/^add((?:\s+(?:<@U\S+>))+)\s+(\S+)$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    const userIds: ReadonlyArray<string> = message.match![1].match(/U[^>]+/g)!;
    const groupname: string = message.match![2];

    if (!slackAdminIds.includes(message.user!)) {
        log.info(`${locale.error.noAuthToAddUserToGroup}. user: ${message.user}`);
        bot.reply(message, locale.error.noAuthToAddUserToGroup);
        return;
    }
    Promise.all(
        userIds.map(userId => {
            return getSlackUserEmailAddress(bot, userId)
                .then(email => {
                    const username = getCrowdUsernameByEmailAddress(email);
                    if (!username) {
                        log.warn(locale.error.invalidEmailAddressFormat(email));
                        return Promise.reject(locale.error.failedToGetSlackUserInfo);
                    } else {
                        return crowd.group.users
                            .add(groupname, username)
                            .then(() => {
                                log.info(locale.crowd.addUserToGroup(username, groupname));
                                return username;
                            })
                            .catch(error => {
                                if (error.type === "MEMBERSHIP_ALREADY_EXISTS") {
                                    return Promise.resolve(undefined);
                                } else if (error.type === "GROUP_NOT_FOUND") {
                                    return Promise.reject(locale.error.noGroupExists(groupname));
                                } else {
                                    return Promise.reject(error);
                                }
                            });
                    }
                })
                .catch(error => {
                    log.info(`${locale.error.failedToGetSlackUserInfo}, error: ${error}`);
                    // ignore if fail to get user info.
                    return Promise.resolve(undefined);
                });
        }),
    )
        .then((usernames: ReadonlyArray<string | undefined>) => {
            const addedUserCount = usernames.filter(username => username !== undefined).length;
            bot.reply(message, locale.slack.addSuccess(addedUserCount, groupname));
        })
        .catch(reason => {
            if (reason && typeof reason === "string") {
                bot.reply(message, reason);
            } else {
                bot.reply(message, locale.error.errorCrowdApi);
            }
        });
});

controller.hears(/^remove((?:\s+(?:<@U\S+>))+)\s+(\S+)$/, "direct_mention", (bot: SlackBot, message: SlackMessage) => {
    const userIds: ReadonlyArray<string> = message.match![1].match(/U[^>]+/g)!;
    const groupname: string = message.match![2];

    if (!slackAdminIds.includes(message.user!)) {
        log.info(`${locale.error.noAuthToRemoveUserToGroup}. user: ${message.user}`);
        bot.reply(message, locale.error.noAuthToRemoveUserToGroup);
        return;
    }
    Promise.all(
        userIds.map(userId => {
            return getSlackUserEmailAddress(bot, userId)
                .then(email => {
                    const username = getCrowdUsernameByEmailAddress(email);
                    if (!username) {
                        log.warn(locale.error.invalidEmailAddressFormat(email));
                        return Promise.reject(locale.error.failedToGetSlackUserInfo);
                    } else {
                        return crowd.group.users
                            .remove(groupname, username)
                            .then(() => {
                                log.info(locale.crowd.removeUserFromGroup(username, groupname));
                                return username;
                            })
                            .catch(error => {
                                if (error.type === "MEMBERSHIP_NOT_FOUND") {
                                    return Promise.resolve(undefined);
                                } else if (error.type === "GROUP_NOT_FOUND") {
                                    return Promise.reject(locale.error.noGroupExists(groupname));
                                } else {
                                    return Promise.reject(error);
                                }
                            });
                    }
                })
                .catch(error => {
                    log.info(`${locale.error.failedToGetSlackUserInfo}, error: ${error}`);
                    // ignore if fail to get user info.
                    return Promise.resolve(undefined);
                });
        }),
    )
        .then((usernames: ReadonlyArray<string | undefined>) => {
            const removedUserCount = usernames.filter(username => username !== undefined).length;
            bot.reply(message, locale.slack.removeSuccess(removedUserCount, groupname));
        })
        .catch(reason => {
            if (reason && typeof reason === "string") {
                bot.reply(message, reason);
            } else {
                bot.reply(message, locale.error.errorCrowdApi);
            }
        });
});

const spawnConfiguration: SlackSpawnConfiguration = {
    token: slackBotToken,
};

controller.spawn(spawnConfiguration).startRTM();
