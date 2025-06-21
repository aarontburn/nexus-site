"use client";

import { createContext, useContext, useState } from "react";
import { FileTree } from "./markdown-accessor";


export type DevelopContextType = {
    sections: FileTree;
    setSections: (sections: FileTree) => void;
    selectedSection: string;
    setSelectedSection: (section: string) => void;
    markdown: string;
    setMarkdown: (markdown: string) => void;
    filePaths: { [shortPath: string]: string };
    setFilePaths: (paths: { [shortPath: string]: string }) => void;
    headings: HTMLElement[];
    setHeadings: (headings: HTMLElement[]) => void;
};

const DevelopContext = createContext<DevelopContextType>({
    sections: {},
    setSections: () => { },
    selectedSection: '',
    setSelectedSection: () => { },
    markdown: '',
    setMarkdown: () => { },
    filePaths: {},
    setFilePaths: () => { },
    headings: [],
    setHeadings: () => []
});

export function DevelopContextProvider({ children }: { children: any }) {
    const [sections, setSections] = useState<FileTree>({});
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [markdown, setMarkdown] = useState<string>('');
    const [filePaths, setFilePaths] = useState<{ [shortPath: string]: string }>({});
    const [headings, setHeadings] = useState<HTMLElement[]>([]);
    return (
        <DevelopContext.Provider value={{
            sections,
            setSections,
            selectedSection,
            setSelectedSection,
            markdown, setMarkdown,
            filePaths, setFilePaths,
            headings, setHeadings
        }}>
            {children}
        </DevelopContext.Provider>
    );
}

export function getDevelopContext() {
    return useContext(DevelopContext);
}