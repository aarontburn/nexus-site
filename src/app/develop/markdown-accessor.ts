"use server";

import * as fs from 'fs';
import * as path from "path";


const DOC_PATH: string = process.cwd() + "/public/docs/";


export type FileTree = {
    [key: string]: FileTree | null; // null means it's a file, not a folder
};

function buildFileTree(paths: string[]): FileTree {
    const root: FileTree = {};

    for (const path of paths) {
        const parts = path.replace(/\\/g, "/").split("/");
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1;

            if (!(part in current)) {
                current[part] = isFile ? null : {};
            }

            if (!isFile) {
                current = current[part] as FileTree;
            }
        }
    }

    return root;
}

export async function getAllDocuments(): Promise<[string[], FileTree]> {
    let files: string[] = await fs.promises.readdir(DOC_PATH, { recursive: true });
    files = files.filter(p => p.endsWith(".md"));
    return [files, buildFileTree(files)];
}


export async function getMarkdown(mdPath: string) {
    const file = await fs.promises.readFile(path.join(DOC_PATH, mdPath), "utf8");
    
    return file;
}