/**
 * Base locale.
 */
export interface Messages extends Resource {
    readonly error: {
        readonly invalidEnvironmentVariable: (variable: string) => string;
        readonly failedToGetSlackUserInfo: string;
        readonly invalidEmailAddressFormat: (email: string) => string;
        readonly errorCrowdApi: string;
        readonly noGroupExists: (groupname: string) => string;
        readonly noAuthToAddUserToGroup: string;
        readonly noAuthToRemoveUserToGroup: string;
    };
    readonly slack: {
        readonly help: string;
        readonly noGroup: string;
        readonly groupList: string;
        readonly noUser: (groupname: string) => string;
        readonly userList: (groupname: string) => string;
        readonly addSuccess: (numUsers: number, groupname: string) => string;
        readonly removeSuccess: (numusers: number, groupname: string) => string;
    };
    readonly crowd: {
        readonly createGroup: string;
        readonly addUserToGroup: (username: string, groupname: string) => string;
        readonly removeUserFromGroup: (username: string, groupname: string) => string;
    };
}

/**
 * Type definition of i18next's Resource.
 */
interface Resource {
    [namespace: string]: { [key: string]: any };
}
