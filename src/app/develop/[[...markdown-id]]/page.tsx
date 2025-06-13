"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { VerticalSpacer } from "../../components/Components";
import styles from "./styles.module.css";
import "./markdown.css"
import { FileTree, getAllDocuments, getMarkdown } from "./markdown-accessor";
import Markdown from "react-markdown";
import React from "react";
import rehypeRaw from 'rehype-raw'
import { usePathname } from 'next/navigation'


function getMarkdownID(pathName: string) {
    const split = pathName.split('/').at(-1) as string;

    if (split === "develop") {
        return undefined;
    }
    return split.replaceAll("%20", " ");
}


export default function DevelopPage() {
    const markdownRef: Ref<HTMLDivElement | null> = useRef(null);
    const selectedMarkdownID: string | undefined = getMarkdownID(usePathname());

    const [sections, setSections] = useState<FileTree>({});
    const [markdown, setMarkdown] = useState<string>('');
    const [filePaths, setFilePaths] = useState<{ [shortPath: string]: string }>({});

    const onSectionPressed = (p: string) => {
        if (filePaths[p] === undefined) {
            return;
        }
        window.history.replaceState({}, '', `/develop/${p}`);
        getMarkdown(filePaths[p]).then((markdown) => {
            setMarkdown(markdown)
        });
    }

    useEffect(() => {

        markdownRef.current?.scroll({
            top: 0
        });
    }, [markdown, markdownRef])

    useEffect(() => {
        const markdownID: string = selectedMarkdownID ?? "1 - Introduction.md";
        if (!filePaths[markdownID]) {
            return;
        }
        getMarkdown(filePaths[markdownID]).then(setMarkdown);
        window.history.replaceState({}, '', `/develop/${markdownID}`);
    }, [filePaths]);


    useEffect(() => {
        getAllDocuments().then(([filePaths, tree]) => {
            setSections(tree);
            const paths: { [shortPath: string]: string } = {};
            if (filePaths.length > 0) {
                const delimiter: "\\" | "/" = filePaths[0].includes("/") ? "/" : "\\"

                for (const p of filePaths) {
                    paths[p.split(delimiter).at(-1) as string] = p;
                }
            }

            setFilePaths(paths);
        });
    }, []);



    return <div style={{ height: "calc(100% - var(--header-size) - 1.15rem)" }}>
        <VerticalSpacer size="1rem" />
        <div className={styles["develop-page"]}>
            <div className={styles["sidebar"]}>
                <FileTreeView onClick={onSectionPressed} tree={sections} />
            </div>


            <div className={styles["markdown-container"]}>
                <div className={"markdown-body"} ref={markdownRef}>
                    <DocMarkdown markdown={markdown} onSectionPressed={onSectionPressed} />

                </div>
                <VerticalSpacer size="5rem" />
            </div>

        </div>
    </div>
}



function DocMarkdown({ markdown, onSectionPressed }: { markdown: string, onSectionPressed: (s: string) => void }) {
    return <Markdown
        components={{
            a: ({ href, children }) => (
                <a
                    href={href}
                    target={href?.startsWith("https") ? "_blank" : '_self'}
                    onClick={(e) => {
                        if (!href?.startsWith("https")) {
                            onSectionPressed((href ?? "").replaceAll("%20", " "));
                            e.preventDefault();
                        }
                    }}
                >
                    {children}
                </a>
            ),
        }}

        urlTransform={(url) => {
            if (url.includes("/assets/")) {
                return `/docs/assets/` + url.split("/").at(-1)
            }

            return url.startsWith("https") ? url : url.split("/").at(-1)
        }}

        rehypePlugins={[rehypeRaw]}
    >
        {markdown}
    </Markdown>
}


const FileTreeView = ({ onClick, tree, level = 0 }: { onClick: (name: string) => void, tree: FileTree, level?: number }) => {
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
                            <FileTreeView onClick={onClick} tree={child} level={level + 1} />
                        </details>
                    ) : (
                        <p
                            onClick={() => onClick(name)}
                            style={{ marginLeft: `${level / 2}rem` }}
                        >
                            {name.includes(".ts") || name.includes(".json") ? <code>{name.replace(".md", '')}</code> : name.replace(".md", '')}
                        </p>
                    )}
                </React.Fragment>
            ))}
        </>
    );

};