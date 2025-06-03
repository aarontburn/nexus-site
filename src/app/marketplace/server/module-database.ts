"use server"
import { getServerSession, Session } from 'next-auth'
import { Collection, MongoClient, ObjectId, WithId } from "mongodb";
import { authOptions } from '../../api/authOptions';
import { ModuleInfo, ModuleInfoWithoutServerSideProperties, UserBookmarkInfo, UserLikedInfo } from '../types';




const { MONGODB_URI } = process.env;
const DATABASE_NAME: string = "nexus-modules";

const MODULE_COLLECTION: string = "modules";
const BOOKMARK_COLLECTION: string = "bookmarks";
const LIKE_COLLECTION: string = "likes";


let client: MongoClient | undefined = undefined;

interface Collections {
    MODULE_COLLECTION: Collection<ModuleInfo>;
    BOOKMARK_COLLECTION: Collection<UserBookmarkInfo>;
    LIKE_COLLECTION: Collection<UserLikedInfo>;
}



async function connectToDatabase(): Promise<Collections> {
    if (process.env.NODE_ENV === "development") {
        let globalWithMongo = global as typeof globalThis & {
            _mongoClient?: MongoClient;
        };

        if (!globalWithMongo._mongoClient) {
            globalWithMongo._mongoClient = new MongoClient(MONGODB_URI as string);
        }
        client = globalWithMongo._mongoClient;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(MONGODB_URI as string);
    }

    const database = client.db(DATABASE_NAME);
    return {
        MODULE_COLLECTION: database.collection<ModuleInfo>(MODULE_COLLECTION),
        BOOKMARK_COLLECTION: database.collection<UserBookmarkInfo>(BOOKMARK_COLLECTION),
        LIKE_COLLECTION: database.collection<UserLikedInfo>(LIKE_COLLECTION),
    }

}



const moduleCache: Map<string, ModuleInfo> = new Map();

export async function getAllRemoteModules(): Promise<[ModuleInfo[], Promise<ModuleInfo[] | undefined>]> {
    const collections: Collections = await connectToDatabase();

    return [Array.from(moduleCache.values()), new Promise(async (resolve) => {
        const result: WithId<ModuleInfo>[] | undefined = await collections.MODULE_COLLECTION.find({}).toArray();
        await Promise.all(result?.map(async moduleInfo => {
            moduleInfo._id = `${moduleInfo._id}`;
            moduleInfo.metadata['like-count'] = await getNumberOfLikesForModule(moduleInfo._id)
            moduleCache.set(moduleInfo["module-id"], moduleInfo);
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




export async function isModuleLiked(moduleObjectID: string): Promise<boolean> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        return false;
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserLikedInfo> | undefined = await collections.LIKE_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    return result ? true : false;
}

export async function onModuleRemoveLiked(moduleObjectID: string): Promise<string | undefined> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        console.error(`Error liking ${moduleObjectID}; unauthorized.`);
        return `Error liking ${moduleObjectID}; unauthorized.`
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserLikedInfo> | undefined = await collections.LIKE_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    if (!result) {
        console.error(`Error removing like from ${moduleObjectID}; entry doesn't exist.`)
        return `Error removing like from ${moduleObjectID}; entry doesn't exist.`;
    }

    await collections.LIKE_COLLECTION.deleteOne({ _id: result._id });
}



export async function onModuleLiked(moduleObjectID: string) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        console.error(`Error liking ${moduleObjectID}; unauthorized.`);
        return `Error liking ${moduleObjectID}; unauthorized.`
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserLikedInfo> | undefined = await collections.LIKE_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    if (result) {
        console.error(`Error liking ${moduleObjectID}; already liked.`)
        return `Error liking ${moduleObjectID}; already liked.`;
    }

    await collections.LIKE_COLLECTION.insertOne({
        'user-id': session.user.id,
        'module-id': moduleObjectID,
        "liked-at": new Date()
    } as any);
}

export async function addModuleToBookmark(moduleObjectID: string) {
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        console.error(`Error adding ${moduleObjectID} to bookmarks; unauthorized.`)
        return "Not authorized."
    }
    const collections: Collections = await connectToDatabase();
    const result: WithId<UserBookmarkInfo> | undefined = await collections.BOOKMARK_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    if (result) {
        console.error(`Error adding ${moduleObjectID} to bookmarks; already added.`)
        return `Error adding ${moduleObjectID} to bookmarks; already added.`;
    }

    await collections.BOOKMARK_COLLECTION.insertOne({
        'user-id': session.user.id,
        'module-id': moduleObjectID,
        "bookmarked-at": new Date(),
    } as any);

}

let likeMap: { [moduleObjectID: string]: number } | undefined = undefined;
async function buildLikeMap() {
    const collections: Collections = await connectToDatabase();
    const likeCounts: WithId<UserLikedInfo>[] = await collections.LIKE_COLLECTION.find({}).toArray();

    likeMap = {};

    likeCounts.forEach(like => {
        likeMap![`${like['module-id']}`] = (likeMap![`${like['module-id']}`] ?? 0) + 1
    });
    return likeMap;
}
export async function getNumberOfLikesForModule(moduleObjectID: string): Promise<number> {
    if (likeMap && likeMap[moduleObjectID] !== undefined) {
        return likeMap[moduleObjectID] ?? 0
    }
    await buildLikeMap();
    return likeMap![moduleObjectID] ?? 0
}




export async function db() {
    const collections: Collections = await connectToDatabase();


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



export async function getModulesFromUser(userID: string): Promise<ModuleInfo[] | undefined> {
    const collections: Collections = await connectToDatabase();

    const result: (WithId<ModuleInfo>[]) | undefined = await collections.MODULE_COLLECTION.find({ "author-id": userID }).toArray();
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
