"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { VerticalSpacer } from "../../components/Components";
import "./styles.css";
import "./markdown.css"
import { FileTree, getAllDocuments, getMarkdown } from "./markdown-accessor";
import Markdown, { UrlTransform } from "react-markdown";
import React from "react";
import rehypeRaw from 'rehype-raw'
import { usePathname, useRouter } from 'next/navigation'

const FileTreeView = ({ onClick, tree, level = 0 }: { onClick: (name: string) => void, tree: FileTree, level?: number }) => {
    return (
        <>
            {Object.entries(tree).sort(([name1, child1], [name2, child2]) => {
            }).map(([name, child], index) => (
                <React.Fragment key={name + index}>
                    {child ? (
                        <details style={{ marginLeft: `${level / 2}rem` }}>
                            <summary>{name}</summary>
                            <FileTreeView onClick={onClick} tree={child} level={level + 1} />
                        </details>
                    ) : (
                        <p
                            onClick={() => onClick(name)}
                            style={{ marginLeft: `${level / 2}rem` }}
                        >
                            {name.replace(".md", '')}
                        </p>
                    )}
                </React.Fragment>
            ))}
        </>
    );

};

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
        if (!filePaths[p]) {
            return;
        }
        window.history.replaceState({}, '', `/develop/${p}`);
        getMarkdown(filePaths[p]).then(setMarkdown);
    }

    useEffect(() => {
        markdownRef.current?.scrollIntoView({ block: "center" })
    }, [markdown])

    useEffect(() => {
        if (selectedMarkdownID) {
            onSectionPressed(selectedMarkdownID);
        }
    }, [filePaths]);

    useEffect(() => {
        getAllDocuments().then(([filePaths, tree]) => {
            setSections(tree);

            const paths: { [shortPath: string]: string } = {};
            for (const p of filePaths) {
                paths[p.split("\\").at(-1) as string] = p;
            }

            setFilePaths(paths);
        });
    }, []);

    return <div style={{ height: "calc(100% - 7rem)" }}>
        <VerticalSpacer size="6rem" />
        <div className="develop-page">
            <div className="sidebar">
                <FileTreeView onClick={onSectionPressed} tree={sections} />
            </div>

            <div className="markdown-body" ref={markdownRef}>
                <Markdown
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

                    urlTransform={(url) => url.startsWith("https") ? url : url.split("/").at(-1)}
                    rehypePlugins={[rehypeRaw]}
                >
                    {markdown}
                </Markdown>


                <VerticalSpacer size="3rem" />

            </div>


        </div>


    </div>
}