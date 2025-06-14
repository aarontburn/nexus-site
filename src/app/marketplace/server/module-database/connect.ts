"use server";

import { Collection, Db, MongoClient } from "mongodb";
import { ModuleInfo, UserBookmarkInfo, UserLikedInfo } from "../../types";
import { BaseAnalytic } from "../../../analytics/analytics-schema";

const { MONGODB_URI } = process.env;
const DATABASE_NAME: string = "nexus-modules";

const MODULE_COLLECTION: string = "modules";
const BOOKMARK_COLLECTION: string = "bookmarks";
const LIKE_COLLECTION: string = "likes";
const ANALYTIC_COLLECTION: string = "analytics";


let client: MongoClient | undefined = undefined;

export interface Collections {
    MODULE_COLLECTION: Collection<ModuleInfo>;
    BOOKMARK_COLLECTION: Collection<UserBookmarkInfo>;
    LIKE_COLLECTION: Collection<UserLikedInfo>;
    ANALYTIC_COLLECTION: Collection<BaseAnalytic>
}


export async function connectToDatabase(): Promise<Collections> {
    if (process.env.NODE_ENV === "development") {
        let globalWithMongo = global as typeof globalThis & {
            _mongoClient?: MongoClient;
        };

        if (!globalWithMongo._mongoClient) {
            globalWithMongo._mongoClient = new MongoClient(MONGODB_URI as string);
        }
        client = globalWithMongo._mongoClient;
    } else {
        if (!client) {
            client = new MongoClient(MONGODB_URI as string);
        }
    }

    const database: Db = client.db(DATABASE_NAME);
    return {
        MODULE_COLLECTION: database.collection<ModuleInfo>(MODULE_COLLECTION),
        BOOKMARK_COLLECTION: database.collection<UserBookmarkInfo>(BOOKMARK_COLLECTION),
        LIKE_COLLECTION: database.collection<UserLikedInfo>(LIKE_COLLECTION),
        ANALYTIC_COLLECTION: database.collection<BaseAnalytic>(ANALYTIC_COLLECTION),
    }

}
