
export type AnalyticTypes =
    "CLIENT_DOWNLOAD" |
    "MODULE_DOWNLOAD" |
    "ACCOUNT_CREATED"


export interface BaseAnalytic {
    type: AnalyticTypes;
    date: Date;
}