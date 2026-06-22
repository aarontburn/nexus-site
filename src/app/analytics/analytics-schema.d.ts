
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
    "REMOTE_INSTALLED_MODULE_FROM_SITE" |
    "REMOTE_IMPORTED_MODULE" |
    "REMOTE_UPDATED_MODULE" |
    "REMOTE_CLIENT_ACTIVE"
    

export interface BaseAnalytic {
    type: AnalyticTypes | RemoteAnalyticTypes;
    date: Date;
    ttl?: Date;
}