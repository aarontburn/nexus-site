"use server";

import { Collections, connectToDatabase } from "../marketplace/server/module-database/connect";
import { BaseAnalytic } from "./analytics-schema";



export async function createClientDownloadAnalytic(platform: "win32" | "darwin" | "linux") {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "CLIENT_DOWNLOAD",
        date: new Date(),
        platform: platform
    } as BaseAnalytic);
}

export async function createModuleDownloadAnalytic(moduleObjectID: string, moduleAppID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_DOWNLOAD",
        date: new Date(),
        moduleID: moduleObjectID,
        moduleAppID: moduleAppID
    } as BaseAnalytic);
}

export async function createAccountAnalytic(email: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "ACCOUNT_CREATED",
        date: new Date(),
        email
    } as BaseAnalytic);
}

export async function createModuleLikeAnalytic(userID: string, moduleObjectID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_LIKED",
        date: new Date(),
        userID: `${userID}`,
        moduleObjectID: `${moduleObjectID}`
    } as BaseAnalytic);
}
export async function createModuleUnlikeAnalytic(userID: string, moduleObjectID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_UNLIKED",
        date: new Date(),
        userID: `${userID}`,
        moduleObjectID: `${moduleObjectID}`
    } as BaseAnalytic);
}


export async function createModuleUploadAnalytic(userID: string, moduleAppID: string, moduleObjectID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_UPLOADED",
        date: new Date(),
        userID: `${userID}`,
        moduleAppID: `${moduleAppID}`,
        moduleObjectID: `${moduleObjectID}`
    } as BaseAnalytic);
}

export async function createModuleEditAnalytic(userID: string, moduleAppID: string, moduleObjectID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_EDITED",
        date: new Date(),
        userID: `${userID}`,
        moduleAppID: `${moduleAppID}`,
        moduleObjectID: `${moduleObjectID}`
    } as BaseAnalytic);
}

export async function createModuleDeleteAnalytic(userID: string, moduleAppID: string) {
    const collections: Collections = await connectToDatabase();

    await collections.ANALYTIC_COLLECTION.insertOne({
        type: "MODULE_DELETED",
        date: new Date(),
        userID: `${userID}`,
        moduleAppID: `${moduleAppID}`,
    } as BaseAnalytic);
}