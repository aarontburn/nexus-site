
export type AnalyticTypes = "CLIENT_DOWNLOAD" | "MODULE_DOWNLOAD"


export interface BaseAnalytic {
    type: AnalyticTypes;
    date: Date;
}

// Triggered when any download button is pressed
export interface DownloadAnalytic {
    type: "CLIENT_DOWNLOAD";
    date: Date;
    platform: "win32" | "linux" | "darwin"
}