
export type AnalyticTypes =
    "CLIENT_DOWNLOAD" |
    "MODULE_DOWNLOAD" |
    "ACCOUNT_CREATED" |
    "MODULE_LIKED" |
    "MODULE_UNLIKED" | 
    "MODULE_UPLOADED" | 
    "MODULE_EDITED" | 
    "MODULE_DELETED"


export interface BaseAnalytic {
    type: AnalyticTypes;
    date: Date;
}