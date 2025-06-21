
"use client";

import React from "react";
import { DevelopContextType, getDevelopContext } from "./context";
import { FileTree } from "./markdown-accessor";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";



export default function LeftSidebar() {
    const context: DevelopContextType = getDevelopContext();
    const router = useRouter();

    return <div className={styles["sidebar"]}>
        <FileTreeView onClick={context.setSelectedSection} tree={context.sections} router={router}/>
    </div>
}


const FileTreeView = ({ onClick, tree, router, level = 0 }: { onClick: (name: string) => void, tree: FileTree, router: AppRouterInstance, level?: number }) => {
    return (
        <>
            {Object.entries(tree).sort((a: [string, FileTree | null], b: [string, FileTree | null]) => {
                const [name1, child1] = a;
                const [name2, child2] = b;

                const isAFolder: boolean = child1 !== null;
                const isBFolder: boolean = child2 !== null;

                if (level === 0) {
                    if (name1 === "Getting Started") {
                        return -1;
                    } else if (name2 === "Getting Started") {
                        return 1;
                    }
                }

                if (isAFolder && !isBFolder) {
                    if (name1.charAt(0) >= "0" && name1.charAt(0) <= "9") {
                        return name1.localeCompare(name2);
                    }
                    return 1;
                }
                if (!isAFolder && isBFolder) {
                    if (name2.charAt(0) >= "0" && name2.charAt(0) <= "9") {
                        return name1.localeCompare(name2);
                    }
                    return -1;
                }

                return name1.localeCompare(name2);

            }).map(([name, child], index) => (
                <React.Fragment key={name + index}>
                    {child ? (
                        <details style={{ marginLeft: `${level}rem` }} open={index === 0}>
                            <summary>{name}</summary>
                            <FileTreeView onClick={onClick} tree={child} level={level + 1} router={router} />
                        </details>
                    ) : (
                        <Link
                        href={`/develop/${name}`}
                            // onClick={() => router.push(`/develop/${name}`)}
                            style={{ marginLeft: `${level / 2}rem` }}
                        >
                            {name.includes(".ts") || name.includes(".json") ? <code>{name.replace(".md", '')}</code> : name.replace(".md", '')}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </>
    );

};