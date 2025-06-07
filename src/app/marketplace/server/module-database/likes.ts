"use server";

import { Session } from "next-auth";
import { WithId, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/authOptions";
import { UserLikedInfo, UserBookmarkInfo, ModuleInfo } from "../../types";
import { Collections, connectToDatabase } from "./connect";


let likeMap: { [moduleObjectID: string]: number } | undefined = undefined;
async function buildLikeMap(): Promise<{ [moduleObjectID: string]: number }> {
    const collections: Collections = await connectToDatabase();
    const likeCounts: WithId<UserLikedInfo>[] = await collections.LIKE_COLLECTION.find({}).toArray();

    likeMap = {};

    likeCounts.forEach(like => {
        likeMap![`${like['module-id']}`] = (likeMap![`${like['module-id']}`] ?? 0) + 1
    });
    return likeMap;
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


export async function removeModuleLike(moduleObjectID: string): Promise<string | undefined> {
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
        console.warn(`Error removing like from ${moduleObjectID}; entry doesn't exist.`)
        return undefined;
    }

    await collections.LIKE_COLLECTION.deleteOne({ _id: result._id });
}



export async function onModuleLiked(moduleObjectID: string): Promise<string | undefined> {
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
        console.warn(`Error liking ${moduleObjectID}; already liked.`)
        return undefined;
    }

    await collections.LIKE_COLLECTION.insertOne({
        'user-id': session.user.id,
        'module-id': moduleObjectID,
        "liked-at": new Date()
    } as any);
}

export async function addModuleToBookmark(moduleObjectID: string): Promise<string | undefined> {
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


export async function getNumberOfLikesForModule(moduleObjectID: string): Promise<number> {
    if (likeMap && likeMap[moduleObjectID] !== undefined) {
        return likeMap[moduleObjectID] ?? 0;
    }
    await buildLikeMap();
    return likeMap![moduleObjectID] ?? 0;
}


export async function getLikedModulesForUser(): Promise<(ModuleInfo & { likeInfo: UserLikedInfo })[] | string> {
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Error retrieving likes; not authorized.";
    }
    const collections: Collections = await connectToDatabase();

    const result: WithId<UserLikedInfo>[] = await collections.LIKE_COLLECTION.find({ "user-id": session.user.id }).toArray();

    const likedModules: (ModuleInfo & { likeInfo: UserLikedInfo })[] = [];

    await Promise.allSettled(result.map(async likeInfo => {
        const module: WithId<ModuleInfo> | null = await collections.MODULE_COLLECTION.findOne({ _id: new ObjectId(likeInfo['module-id']) as any });
        if (module) {
            module._id = `${module._id}`;
            likeInfo._id = `${likeInfo._id}`;
            module.metadata["like-count"] = await getNumberOfLikesForModule(`${module._id}`);

            likedModules.push({...module, likeInfo: likeInfo});
        }
    }))
    return likedModules;
}
