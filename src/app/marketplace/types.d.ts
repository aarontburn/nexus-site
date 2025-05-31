/**
 *  Module info stored in MongoDB
 */
export interface ModuleInfo {
    _id: string;    // mongodb object ID
    name: string;
    "module-id": string;
    author: string;
    "author-id": string;
    version: string;
    repository: string;
    description?: string | undefined;
    image?: string | undefined;
    readme?: string | undefined;


    // Metadata
    tags?: string[] | undefined;

    metadata: ModuleInfoMetadata
}

export interface ModuleInfoMetadata {
    platforms?: string[] | undefined;
    "date-uploaded": Date;
    "date-modified": Date;
    "download-count": number;

    "rating-count": number;
    "rating-sum": number;
}

/**
 *  Client -> Server module info without properties set from the server-side.
 */
export type ModuleInfoWithoutServerSideProperties =
    Omit<ModuleInfo, "_id" | "author-id" | "author" | "metadata"> & {
        metadata: Partial<ModuleInfoMetadata>
    };

/**
 *  Imported module info from module-info.json
 */
export interface RemoteModuleInfoJSON {
    name: string;
    id: string;
    version: string;

    author?: string | undefined;
    "author-id"?: string | undefined;
    description?: string | undefined;
    link?: string | undefined;
    platforms?: string[] | undefined;
    "git-latest"?: {
        "git-username": string;
        "git-repo-name": string;
    };
    build: {
        "build-version": number;
        excluded?: string[] | undefined;
        included?: string[] | undefined;
        process: string;
        replace?: {
            from: string;
            to: string;
            at: string[]
        }[] | undefined
    }
}