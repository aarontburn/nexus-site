"use server";

import { Session } from "next-auth";
import { WithId, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/authOptions";
import { ModuleInfo, ModuleInfoWithoutServerSideProperties } from "../../types";
import { Collections, connectToDatabase } from "./connect";
import { getNumberOfLikesForModule } from "./likes";

const moduleCache: Map<string, ModuleInfo> = new Map();


export async function getAllRemoteModules(): Promise<[ModuleInfo[], Promise<ModuleInfo[] | undefined>]> {
    const collections: Collections = await connectToDatabase();

    return [Array.from(moduleCache.values()), new Promise(async (resolve) => {
        const result: WithId<ModuleInfo>[] | undefined = await collections.MODULE_COLLECTION.find({}).toArray();
        await Promise.all(result?.map(async moduleInfo => {
            moduleInfo._id = `${moduleInfo._id}`;
            moduleInfo.metadata['like-count'] = await getNumberOfLikesForModule(moduleInfo._id);
            moduleCache.set(`${moduleInfo._id}`, moduleInfo);
        }))
        resolve(result);
    })];
}


export async function onModuleDownloaded(_id: string) {
    const collections: Collections = await connectToDatabase();

    const result: WithId<ModuleInfo> | undefined = await collections.MODULE_COLLECTION.findOne({ _id: new ObjectId(_id) as any }) ?? undefined;

    if (!result) {
        console.error("Couldn't find module to increment download count: " + _id);
        return;
    }

    try {
        await collections.MODULE_COLLECTION.updateOne(
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


export async function getModule(moduleObjectID: string): Promise<[ModuleInfo | undefined, Promise<ModuleInfo | undefined>]> {
    const collections: Collections = await connectToDatabase();

    return [moduleCache.get(moduleObjectID), new Promise(async (resolve) => {
        const result: WithId<ModuleInfo> | undefined = await collections.MODULE_COLLECTION.findOne({ _id: new ObjectId(moduleObjectID) as any }) ?? undefined;
        if (!result) {
            return undefined;
        }

        result.metadata['like-count'] = await getNumberOfLikesForModule(moduleObjectID);
        result._id = `${result._id}`;
        moduleCache.set(moduleObjectID, result);
        resolve(result)
    })];
}



export async function getUploadedModules(): Promise<ModuleInfo[] | string> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        return "Not authorized.";
    }

    const collections: Collections = await connectToDatabase();

    const result: WithId<ModuleInfo>[] = await collections.MODULE_COLLECTION.find({ "author-id": session.user.id }).toArray();

    result?.forEach(info => {
        info._id = `${info._id}`;
        moduleCache.set(`${info._id}`, info);
    })
    return result;
}

export async function editRemoteModule(moduleInfo: ModuleInfoWithoutServerSideProperties) {
    const collections: Collections = await connectToDatabase();

    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        return "Not authorized."
    }

    const userID: string = session.user.id;
    const result: WithId<ModuleInfo> | undefined = await collections.MODULE_COLLECTION.findOne(
        {
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }
    ) ?? undefined;

    if (!result) {
        return `Error editing module; no module found from user ${session.user.email} with id ${moduleInfo['module-id']}`;
    }

    try {
        await collections.MODULE_COLLECTION.replaceOne({
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
    const collections: Collections = await connectToDatabase();


    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Not authorized."
    }

    const userID: string = session.user.id;
    const result: WithId<ModuleInfo> | undefined = await collections.MODULE_COLLECTION.findOne(
        {
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }
    ) ?? undefined;

    if (!result) {
        return `Error deleting module; no module found from user ${session.user.email} with id ${moduleInfo['module-id']}`;
    }

    await collections.MODULE_COLLECTION.deleteOne({
        "author-id": userID,
        "module-id": moduleInfo['module-id']
    })


    await collections.LIKE_COLLECTION.deleteMany({ "module-id": moduleInfo['module-id'] })

}

export async function insertModule(moduleInfo: ModuleInfoWithoutServerSideProperties) {
    const collections: Collections = await connectToDatabase();

    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Not authorized."
    }

    const userID: string = session.user.id;
    const result: WithId<ModuleInfo> | undefined = await collections.MODULE_COLLECTION.findOne(
        {
            "author-id": userID,
            "module-id": moduleInfo['module-id']
        }
    ) ?? undefined;

    if (result) {
        return `Error inserting module; Module with the ID of ${moduleInfo["module-id"]} already found for user.`
    }

    try {
        await collections.MODULE_COLLECTION.insertOne({
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
