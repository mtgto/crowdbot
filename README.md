# Crowdbot - A Slack bot integrate with Atlassian crowd

## Feature

This bot supports management of groups of Atlassian crowd.

-   Show crowd groups which you belong to.
-   Show the members which belong to group.
-   (Only admin) create <groupname> Create a new group.
-   (Only admin) Add user(s) to Crowd group.
-   (Only admin) Remove user(s) from Crowd group.",

## Setup

### 1. Create a new Crowd application

-   Add permissions `Add group` and `Modify group`.
-   Set remote addresses.

### 2. Create a Slack bot

Create a bot and get token at https://my.slack.com/services/new/bot .

### 3. Launch

```console
yarn install

CROWDBOT_LANG=en \
CROWD_BASE_URL=https://crowd.example.com/ \
CROWD_APPLICATION=crowdbot \
CROWD_PASSWORD=secret \
SLACK_BOT_TOKEN=xoxo-xxx-xx-xx-xxxx \
SLACK_ADMIN_IDS=U123456,U23456 \
node .
```

## Configuration

All configuration is set by environment variables.

| Name              | Description                                                                                                                                              | Example                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| CROWDBOT_LANG     | Message locale. <br/>You can choose between "en" or "ja" (default "en").                                                                                 | "en" (or empty)            |
| CROWD_BASE_URL    | Crowd URL                                                                                                                                                | https://crowd.example.com/ |
| CROWD_APPLICATION | Crowd Applicaton name. <br/>We highly recommend not to use "crowd".                                                                                      | "crowdbot"                 |
| CROWD_PASSWORD    | Crowd application's password. This is NOT admin password.                                                                                                | "secret"                   |
| SLACK_BOT_TOKEN   | Slack token string.                                                                                                                                      | xoxo-xxx-xx-xx-xxxx        |
| SLACK_ADMIN_IDS   | Slack ids of Crowd administrators which have authorization to add/remove user and create a crowd group.<br/>Multiple users can be defined join by comma. | U123456,U23456             |

## License

This software is released under the MIT License, see LICENSE.
