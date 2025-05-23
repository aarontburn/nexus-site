"use client";

import { useEffect, useState } from "react";
import { VerticalSpacer } from "../components/Components";
import "./styles.css";
import { FileTree, getAllDocuments, getMarkdown } from "./markdown-accessor";
import Markdown from "react-markdown";
import React from "react";

const FileTreeView = ({ onClick, tree, level = 0 }: { onClick: (name: string) => void, tree: FileTree, level?: number }) => {
    return (
        <>
            {Object.entries(tree).map(([name, child], index) => (
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


export default function DevelopPage() {
    const [sections, setSections] = useState<FileTree>({});
    const [markdown, setMarkdown] = useState<string>('');
    const [filePaths, setFilePaths] = useState<{ [shortPath: string]: string }>({});

    const onSectionPressed = (p: string) => {
        getMarkdown(filePaths[p]).then(setMarkdown);
    }

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

    return <div style={{ height: "100%" }}>
        <VerticalSpacer size="7rem" />

        <div className="develop-page">
            <div className="sidebar">
                <FileTreeView onClick={onSectionPressed} tree={sections} />
            </div>

            <div className="develop-content">
                <Markdown>{markdown}</Markdown>
            </div>


        </div>

    </div>
}