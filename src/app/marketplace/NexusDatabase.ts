"use server"

import { Collection, Db, MongoClient, WithId } from "mongodb";

export interface ModuleInfo {
    name: string;
    id: string;
    author: string;
    version: string;
    description?: string | undefined;
    link?: string | undefined;
    platforms?: string[] | undefined;
    image?: string | undefined;
    readme?: string | undefined;
}



const URI: string = `mongodb+srv://readonly:readonly@nexus-modules.hkxvzhe.mongodb.net/?retryWrites=true&w=majority&appName=nexus-modules`;
const DATABASE_NAME: string = "nexus-modules";
const COLLECTION_NAME: string = "modules";



let client: MongoClient | undefined = undefined;
let database: Db | undefined = undefined;
let moduleCollection: Collection<ModuleInfo> | undefined = undefined;


const moduleCache: Map<string, ModuleInfo> = new Map();

export async function connectToDatabase() {
    console.log("Creating a new connection to the database.")
    client = new MongoClient(URI);
    database = client.db(DATABASE_NAME);
    moduleCollection = database.collection<ModuleInfo>(COLLECTION_NAME);
}

export async function getAllRemoteModules(): Promise<[ModuleInfo[], Promise<ModuleInfo[] | undefined>]> {
    if (!client) {
        await connectToDatabase();
    }

    return [Array.from(moduleCache.values()), new Promise(async (resolve) => {

        const result: WithId<ModuleInfo>[] | undefined = await moduleCollection?.find({}).toArray();
        result?.forEach(info => {
            info._id = `${info._id}` as any;
            moduleCache.set(info.id, info);
        })
        resolve(result);
    })];


}

export async function getModule(moduleID: string): Promise<ModuleInfo | undefined> {
    if (moduleCache.has(moduleID)) {
        return moduleCache.get(moduleID);
    }

    if (!client) {
        await connectToDatabase();
    }
    const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne({ id: moduleID }) ?? undefined;
    if (!result) {
        return undefined;
    }
    result._id = `${result._id}` as any;
    moduleCache.set(moduleID, result);
    return result
}