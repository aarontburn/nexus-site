"use client";

import { Ref, useContext, useEffect, useRef, useState } from "react";
import { VerticalSpacer } from "../../components/Components";
import styles from "./styles.module.css";
import "./markdown.css"
import { FileTree, getAllDocuments, getMarkdown } from "./markdown-accessor";
import Markdown from "react-markdown";
import React from "react";
import rehypeRaw from 'rehype-raw'
import { usePathname, useRouter } from 'next/navigation'
import { DevelopContextType, getDevelopContext } from "./context";
import LeftSidebar from "./LeftSidebar";


function getMarkdownID(pathName: string): string | undefined {
    const split = pathName.split('/').at(-1) as string;

    if (split === "develop") {
        return undefined;
    }
    return split.replaceAll("%20", " ");
}


export default function DevelopPage() {
    const context: DevelopContextType = getDevelopContext();

    const markdownRef: Ref<HTMLDivElement | null> = useRef(null);

    const pathName = usePathname();
    const router = useRouter();


    const onSectionPressed = (markdownID: string) => {
        if (context.filePaths[markdownID] === undefined) {
            return;
        }
        router.push(`/develop/${markdownID}`);
    }

    useEffect(() => {
        const markdownID: string = getMarkdownID(pathName) ?? "1 - Introduction.md";
        if (context.filePaths[markdownID] === undefined) {
            return;
        }

        getMarkdown(context.filePaths[markdownID]).then((markdown) => {
            context.setMarkdown(markdown)
        });
    }, [pathName, context.filePaths])



    useEffect(() => {
        const nodes: HTMLElement[] = Array.from(markdownRef.current?.childNodes || []) as HTMLElement[];
        const headerNodes = nodes.filter((node) =>
            node.nodeType === 1 &&
            node.tagName.startsWith("H")
        );
        context.setHeadings(headerNodes.slice(1));
        (markdownRef.current?.firstChild as HTMLElement)?.scrollIntoView()

    }, [context.markdown, markdownRef])


    useEffect(() => {
        getAllDocuments().then(([filePaths, tree]) => {
            context.setSections(tree);
            const paths: { [shortPath: string]: string } = {};
            if (filePaths.length > 0) {
                const delimiter: "\\" | "/" = filePaths[0].includes("/") ? "/" : "\\"

                for (const p of filePaths) {
                    paths[p.split(delimiter).at(-1) as string] = p;
                }
            }
            context.setFilePaths(paths);
        });
    }, []);



    return <div style={{ height: "calc(100% - var(--header-size) - 1.15rem)" }}>
        <VerticalSpacer size="1rem" />
        <div className={styles["develop-page"]}>


            <div className={styles["markdown-container"]}>
                <div className={"markdown-body"} ref={markdownRef}>
                    <DocMarkdown markdown={context.markdown} onSectionPressed={onSectionPressed} />

                </div>
                <VerticalSpacer size="5rem" />
            </div>

            <div className={styles["sections-container"]}>
                {context.headings.map((node, index) => {
                    const headingType: string = node.tagName;
                    const isCodeElement: boolean = (node.firstChild as HTMLElement)?.tagName === "CODE";
                    return <p
                        key={index}
                        style={{ marginLeft: `${Number(headingType.at(-1)) - 1}rem` }}
                        onClick={() => node.scrollIntoView({ behavior: "smooth" })}
                    >
                        {isCodeElement ? <code>{node.textContent}</code> : node.textContent}
                    </p>
                })}
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

