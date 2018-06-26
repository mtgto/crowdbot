import { format } from "util";
import { Messages } from "./messages";

export const ja: Messages = {
    error: {
        invalidEnvironmentVariable: (variable: string): string =>
            format('環境変数 "%s" がセットされていません。READMEを参照してください。', variable),
        failedToGetSlackUserInfo: "Slackユーザー情報の取得ができませんでした。",
        invalidEmailAddressFormat: (email: string): string => format('メールアドレス "%s" が不正な形式です。', email),
        errorCrowdApi: "Crowd API がエラーを返しました。",
        noGroupExists: (groupname: string): string => format('グループ "%s" が存在しません。', groupname),
        noAuthToAddUserToGroup: "ユーザー追加の権限がありません。",
        noAuthToRemoveUserToGroup: "ユーザー削除の権限がありません。",
    },
    slack: {
        help: [
            "このボットはAtlassian Crowdのグループ管理をサポートします。",
            "ボット宛のメンションで受け付けます。",
            "■機能一覧",
            "list あなたが所属するCrowdのグループを表示します。",
            "list <グループ名> Crowdのグループに所属するユーザーを表示します。",
            "[要Admin] create <グループ名> グループを新しく作成します",
            "[要Admin] add <Slackユーザー> ... <Slackユーザー> <グループ名> ユーザーをCrowdのグループに追加します",
            "[要Admin] remove <Slackユーザー> ... <Slackユーザー> <グループ名> ユーザーをCrowdのグループから削除します",
            "詳しくは https://github.com/mtgto/crowdbot",
        ].join("\n"),
        noGroup: "どのグループにも所属していません。",
        groupList: "次のグループに所属しています: ",
        noUser: (groupname: string): string => format('グループ "%s" はメンバーがいません。', groupname),
        userList: (groupname: string): string => format('グループ "%s" のメンバーは次の通りです: ', groupname),
        addSuccess: (numUsers: number, groupname: string): string =>
            format('%d ユーザーをグループ "%s" に追加しました。', numUsers, groupname),
        removeSuccess: (numUsers: number, groupname: string): string =>
            format('%d ユーザーをグループ "%s" から削除しました。', numUsers, groupname),
    },
    crowd: {
        createGroup: "新しいグループを作成しました。",
        addUserToGroup: (username: string, groupname: string): string =>
            format('"%s" をグループ "%s" に追加しました。', username, groupname),
        removeUserFromGroup: (username: string, groupname: string): string =>
            format('"%s" をグループ "%s" から削除しました。', username, groupname),
    },
};
