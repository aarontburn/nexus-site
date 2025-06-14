"use server";

import { Collections, connectToDatabase } from "../marketplace/server/module-database/connect";
import { BaseAnalytic, DownloadAnalytic } from "./analytics-schema";



export async function createNewClientDownloadAnalytic(platform: "win32" | "darwin" | "linux") {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "CLIENT_DOWNLOAD",
        date: new Date(),
        platform: platform
    } as BaseAnalytic);
}

export async function createNewModuleDownloadAnalytic(moduleObjectID: string, moduleAppID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_DOWNLOAD",
        date: new Date(),
        moduleID: moduleObjectID,
        moduleAppID: moduleAppID
    } as BaseAnalytic);
}