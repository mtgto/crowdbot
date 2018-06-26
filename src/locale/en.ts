import { format } from "util";
import { Messages } from "./messages";

export const en: Messages = {
    error: {
        invalidEnvironmentVariable: (variable: string): string =>
            format('Environment variable "%s" is not set. Please see README.', variable),
        failedToGetSlackUserInfo: "Failed to get your information of slack.",
        invalidEmailAddressFormat: (email: string): string => format('User email address "%s" is invalid.', email),
        errorCrowdApi: "Crowd API returns an error.",
        noGroupExists: (groupname: string): string => format('Group "%s" doesn\'t exists.', groupname),
        noAuthToAddUserToGroup: "You have no authorization to add user to crowd group.",
        noAuthToRemoveUserToGroup: "You have no authorization to remove user from crowd group.",
    },
    slack: {
        help: [
            "This bot supports management of groups of Atlassian crowd.",
            "You mention me to run below functions.",
            "■ Functions",
            "list Show crowd groups which you belong to.",
            "list <groupname> Show the members which belong to group.",
            "[Admin] create <groupname> Create a new group.",
            "[Admin] add <Slack user> ... <Slack user> <groupname> Add user(s) to Crowd group.",
            "[Admin] remove <Slack user> ... <Slack user> <groupname> Remove user(s) from Crowd group.",
            "For details: https://github.com/mtgto/crowdbot",
        ].join("\n"),
        noGroup: "You belong to no group.",
        groupList: "You belong to these groups: ",
        noUser: (groupname: string): string => format('Group "%s" has no member.', groupname),
        userList: (groupname: string): string => format('Group "%s" has: ', groupname),
        addSuccess: (numUsers: number, groupname: string): string =>
            format('Success to add %d users to group "%s".', numUsers, groupname),
        removeSuccess: (numUsers: number, groupname: string): string =>
            format('Success to remove %d users from group "%s".', numUsers, groupname),
    },
    crowd: {
        createGroup: "Success to create new group.",
        addUserToGroup: (username: string, groupname: string): string =>
            format('Add user "%s" to group "%s".', username, groupname),
        removeUserFromGroup: (username: string, groupname: string): string =>
            format('Remove user "%s" from group "%s".', username, groupname),
    },
};
