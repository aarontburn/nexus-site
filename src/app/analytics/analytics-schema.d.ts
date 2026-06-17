
export type AnalyticTypes =
    "CLIENT_DOWNLOAD" |
    "MODULE_DOWNLOAD" |
    "ACCOUNT_CREATED" |
    "MODULE_LIKED" |
    "MODULE_UNLIKED" | 
    "MODULE_UPLOADED" | 
    "MODULE_EDITED" | 
    "MODULE_DELETED"

export type RemoteAnalyticTypes = 
    "REMOTE_CLIENT_FIRST_BOOT" |
    "REMOTE_CLIENT_UPDATED" |
    "REMOTE_CLIENT_UNINSTALL" |
    "REMOTE_INSTALLED_MODULE" 

export interface BaseAnalytic {
    type: AnalyticTypes | RemoteAnalyticTypes;
    date: Date;
}