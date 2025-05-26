"use server"
import { getServerSession, Session } from 'next-auth'
import { Collection, Db, MongoClient, WithId } from "mongodb";
import { authOptions } from '../api/auth/[...nextauth]/route';

export interface ModuleInfo {
    _id: string;
    name: string;
    "module-id": string;

    author: string;
    "author-id": string;


    version: string;
    description?: string | undefined;
    link?: string | undefined;
    repository?: string | undefined;

    platforms?: string[] | undefined;
    image?: string | undefined;
    readme?: string | undefined;
}



const { MONGODB_URI } = process.env;
const DATABASE_NAME: string = "nexus-modules";
const COLLECTION_NAME: string = "modules";


let client: MongoClient | undefined = undefined;
let database: Db | undefined = undefined;


let moduleCollection: Collection<ModuleInfo> | undefined = undefined;


const moduleCache: Map<string, ModuleInfo> = new Map();

async function connectToDatabase() {
    console.log("Creating a new connection to the database.")
    client = new MongoClient(MONGODB_URI as string);
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
            info._id = `${info._id}`;
            moduleCache.set(info["module-id"], info);
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
    const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne({ "module-id": moduleID }) ?? undefined
    if (!result) {
        return undefined;
    }
    result._id = `${result._id}`;
    moduleCache.set(moduleID, result);
    return result
}





export async function getModulesFromUser(userID: string): Promise<ModuleInfo[] | undefined> {
    if (!client) {
        await connectToDatabase();
    }

    const result: (WithId<ModuleInfo>[]) | undefined = await moduleCollection?.find({ "author-id": userID }).toArray();
    if (!result) {
        return undefined;
    }
    result?.forEach(info => {
        info._id = `${info._id}`;
        moduleCache.set(info["module-id"], info);
    })
    return result;
}

export async function editRemoteModule(moduleInfo: Omit<ModuleInfo, "author-id">) {
    if (!client) {
        await connectToDatabase();
    }

    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Not authorized."
    }

    const userID: string = session.user.id;
    const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne(
        {
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }
    ) ?? undefined;

    if (!result) {
        return `Error editing module; no module found from user ${session.user.email} with id ${session.user.id}`;
    }

    await moduleCollection?.replaceOne({ _id: moduleInfo._id})


}

export async function insertModule(moduleInfo: Omit<ModuleInfo, "_id" | "author-id">) {
    if (!client) {
        await connectToDatabase();
    }

    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Not authorized."
    }

    const userID: string = session.user.id;
    const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne(
        {
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }
    ) ?? undefined;

    if (result) {
        return `Error inserting module; Module with the ID of ${moduleInfo["module-id"]} already found for user.`
    }

    try {
        await moduleCollection?.insertOne({
            ...moduleInfo,
            "author-id": userID,
        } as any);


        return undefined;
    } catch (error) {
        console.error("Error inserting module:", error);
    }
    return "An error occurred while inserting the module.";
}
