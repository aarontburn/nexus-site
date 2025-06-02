"use server"
import { getServerSession, Session } from 'next-auth'
import { Collection, Db, MongoClient, ObjectId, WithId } from "mongodb";
import { authOptions } from '../../api/authOptions';
import { ModuleInfo, ModuleInfoWithoutServerSideProperties } from '../types';




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

export async function onModuleDownloaded(_id: string) {
    if (!client) {
        await connectToDatabase();
    }

    const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne({ _id: new ObjectId(_id) as any }) ?? undefined;

    if (!result) {
        console.error("Couldn't find module to increment download count: " + _id);
        return;
    }

    try {
        await moduleCollection?.updateOne(
            { _id: new ObjectId(_id) as any },
            {
                $inc: {
                    "metadata.download-count": 1
                }
            }
        );
    } catch (e) {
        console.log(e)
    }



}


export async function db() {
    if (!client) {
        await connectToDatabase();
    }

    // const result: WithId<ModuleInfo>[] | undefined = await moduleCollection?.find({}).toArray();

    // for (const moduleInfo of result ?? []) {
    //     await moduleCollection?.updateOne(
    //         { _id: new ObjectId(moduleInfo._id) as any },
    //         {
    //             $set: {
    //                 "metadata.like-count": 0
    //             },
    //             $unset: {
    //                 "metadata.rating-count": "",
    //                 "metadata.rating-sum": ""
    //             }
    //         }
    //     );
    // }




}

export async function getModule(_id: string): Promise<[ModuleInfo | undefined, Promise<ModuleInfo | undefined>]> {
    if (!client) {
        await connectToDatabase();
    }


    return [moduleCache.get(_id), new Promise(async (resolve) => {
        const result: WithId<ModuleInfo> | undefined = await moduleCollection?.findOne({ _id: new ObjectId(_id) as any }) ?? undefined;
        if (!result) {
            return undefined;
        }
        result._id = `${result._id}`;
        moduleCache.set(_id, result);
        resolve(result)
    })];
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

export async function editRemoteModule(moduleInfo: ModuleInfoWithoutServerSideProperties) {
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
        return `Error editing module; no module found from user ${session.user.email} with id ${moduleInfo['module-id']}`;
    }

    try {
        await moduleCollection?.replaceOne({
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }, {
            ...moduleInfo,
            "author-id": userID,
            "author": session.user.name,
            metadata: {
                ...moduleInfo.metadata,
                "date-modified": new Date(),
                ...(moduleInfo.metadata["date-uploaded"] ? {} : { "date-uploaded": new Date() }),
            }
        } as any);

        return undefined;
    } catch (err) {
        console.error("Error inserting module:", err);
    }
    return "An error occurred while inserting the module.";
}


export async function deleteRemoteModule(moduleInfo: ModuleInfo) {
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
        return `Error deleting module; no module found from user ${session.user.email} with id ${moduleInfo['module-id']}`;
    }

    try {
        await moduleCollection?.deleteOne({
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        })
        return undefined;
    } catch (err) {
        console.error("Error inserting module:", err);
    }
    return "An error occurred while inserting the module.";
}

export async function insertModule(moduleInfo: ModuleInfoWithoutServerSideProperties) {
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
            "author": session.user.name,
            metadata: {
                ...moduleInfo.metadata,
                "date-uploaded": new Date(),
                "date-modified": new Date(),
                "download-count": 0,
                "like-count": 0,
            }

        } as any);


        return undefined;
    } catch (error) {
        console.error("Error inserting module:", error);
    }
    return "An error occurred while inserting the module.";
}
