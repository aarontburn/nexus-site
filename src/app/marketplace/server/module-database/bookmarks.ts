"use server";

import { Session } from "next-auth";
import { WithId, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/authOptions";
import { UserBookmarkInfo, ModuleInfo } from "../../types";
import { Collections, connectToDatabase } from "./connect";


export async function isModuleBookmarked(moduleObjectID: string): Promise<boolean> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        return false;
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserBookmarkInfo> | undefined = await collections.BOOKMARK_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    return result ? true : false;
}


export async function removeBookmarkedModule(moduleObjectID: string): Promise<string | undefined> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        console.error(`Error liking ${moduleObjectID}; unauthorized.`);
        return `Error liking ${moduleObjectID}; unauthorized.`
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserBookmarkInfo> | undefined = await collections.BOOKMARK_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    if (!result) {
        console.error(`Error removing bookmark from from ${moduleObjectID}; entry doesn't exist.`)
        return `Error removing bookmark from ${moduleObjectID}; entry doesn't exist.`;
    }

    await collections.BOOKMARK_COLLECTION.deleteOne({ _id: result._id });
}



export async function bookmarkModule(moduleObjectID: string): Promise<string | undefined> {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user.id) {
        console.error(`Error bookmarking ${moduleObjectID}; unauthorized.`);
        return `Error bookmarking ${moduleObjectID}; unauthorized.`
    }

    const collections: Collections = await connectToDatabase();
    const result: WithId<UserBookmarkInfo> | undefined = await collections.BOOKMARK_COLLECTION.findOne({
        "user-id": session.user.id,
        "module-id": moduleObjectID
    }) ?? undefined;

    if (result) {
        console.error(`Error bookmarking ${moduleObjectID}; already liked.`)
        return `Error liking ${moduleObjectID}; already liked.`;
    }

    await collections.BOOKMARK_COLLECTION.insertOne({
        'user-id': session.user.id,
        'module-id': moduleObjectID,
        "bookmarked-at": new Date(),
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


export async function getBookmarkedModules(): Promise<(ModuleInfo & { bookmarkInfo: UserBookmarkInfo })[] | string> {
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user.id) {
        return "Error retrieving bookmarks; not authorized.";
    }
    const collections: Collections = await connectToDatabase();

    const result: WithId<UserBookmarkInfo>[] = await collections.BOOKMARK_COLLECTION.find({ "user-id": session.user.id }).toArray();

    const bookmarkedModules: (ModuleInfo & { bookmarkInfo: UserBookmarkInfo })[] = [];
    for (const bookmarkInfo of result) {
        const module: WithId<ModuleInfo> | null = await collections.MODULE_COLLECTION.findOne({ _id: new ObjectId(bookmarkInfo['module-id']) as any });
        if (module) {
            module._id = `${module._id}`;
            bookmarkInfo._id = `${bookmarkInfo._id}`;
            bookmarkedModules.push({ ...module, bookmarkInfo: bookmarkInfo });
        }
    }
    return bookmarkedModules;
}
