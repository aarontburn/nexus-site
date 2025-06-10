"use client"

import { Ref, useEffect, useRef, useState } from "react";
import styles from "./marketplace.module.css"
import { getAbbreviation } from "../utils/utils";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../components/Components";
import MarketplaceHeader from "./MarketplaceHeader";
import { ModuleInfo } from "./types";
import { getAllRemoteModules } from "./server/module-database/modules";
import { SessionContextValue, useSession } from "next-auth/react";

const SORT_OPTIONS: { [value: string]: string } = {
    "modified-descend": 'Date Modified (New - Old)',
    "modified-ascend": 'Date Modified (Old - New)',
    "name-descend": 'Name (A - Z)',
    "name-ascend": 'Name (Z  - A)',
    "upload-descend": 'Date Uploaded (New - Old)',
    "upload-ascend": 'Date Uploaded (Old - New)',
    "like-descend": 'Like Count (Most - Least)',
    "like-ascend": 'Like Count (Least - Most)',
    "downloads-descend": 'Download Count (Most - Least)',
    "downloads-ascend": 'Download Count (Least - Most)',
}

const sortFunction = (selectedSort: string, a: ModuleInfo, b: ModuleInfo) => {
    switch (selectedSort) {
        case "name-descend": {
            return a.name.localeCompare(b.name);
        }
        case "name-ascend": {
            return b.name.localeCompare(a.name);
        }
        case "upload-descend": {
            if (a.metadata["date-uploaded"]?.getTime() === b.metadata["date-uploaded"]?.getTime()) {
                return a.name.localeCompare(b.name);
            }

            return a.metadata["date-uploaded"] < b.metadata["date-uploaded"] ? 1 : -1;
        }
        case "upload-ascend": {
            if (a.metadata["date-uploaded"]?.getTime() === b.metadata["date-uploaded"]?.getTime()) {
                return a.name.localeCompare(b.name);
            }

            return b.metadata["date-uploaded"] < a.metadata["date-uploaded"] ? 1 : -1;
        }
        case "modified-descend": {
            if (a.metadata["date-modified"]?.getTime() === b.metadata["date-modified"]?.getTime()) {
                return a.name.localeCompare(b.name);
            }

            return a.metadata["date-modified"] < b.metadata["date-modified"] ? 1 : -1;
        }
        case "modified-ascend": {
            if (a.metadata["date-modified"]?.getTime() === b.metadata["date-modified"]?.getTime()) {
                return a.name.localeCompare(b.name);
            }

            return b.metadata["date-modified"] < a.metadata["date-modified"] ? 1 : -1;
        }
        case "like-descend": {
            const difference = b.metadata["like-count"] - a.metadata["like-count"];
            if (difference === 0) {
                return a.name.localeCompare(b.name);
            }
            return difference;
        }
        case "like-ascend": {
            const difference = a.metadata["like-count"] - b.metadata["like-count"];
            if (difference === 0) {
                return a.name.localeCompare(b.name);
            }
            return difference;
        }
        case "downloads-descend": { // most to least
            const difference: number = b.metadata["download-count"] - a.metadata["download-count"];
            if (difference === 0) {
                return a.name.localeCompare(b.name);
            }
            return difference;
        }
        case "downloads-ascend": { // least to most
            const difference: number = a.metadata["download-count"] - b.metadata["download-count"];
            if (difference === 0) {
                return a.name.localeCompare(b.name);
            }
            return difference;
        }

    }
    return a.name.localeCompare(b.name);
}


export default function NexusMarket() {

    const searchBarRef: Ref<HTMLInputElement> = useRef(null);

    const [query, setQuery] = useState<string>('');
    const [queryKey, setQueryKey] = useState<number>(0);
    const [selectedSort, setSelectedSort] = useState<string>(Object.keys(SORT_OPTIONS)[0]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [databaseModules, setDatabaseModules] = useState<ModuleInfo[]>([]);
    const [displayedModules, setDisplayedModules] = useState<ModuleInfo[]>([]);

    useEffect(() => {
        setIsLoading(true)
        getAllRemoteModules().then(([cachedModules, resolvingModules]) => {
            setDatabaseModules(cachedModules ?? []);
            setDisplayedModules(cachedModules ?? []);

            resolvingModules.then(result => {
                setDatabaseModules(result ?? []);
                setDisplayedModules(result ?? []);
                setIsLoading(false);
            });

            if (cachedModules && cachedModules.length > 0) {
                setIsLoading(false)
            }
        })
    }, []);


    const searchForModule = () => {
        if (!searchBarRef.current) {
            return
        };

        const query: string = searchBarRef.current.value.toLowerCase().trim();
        if (!query) {
            setDisplayedModules(databaseModules);
            return;
        }


        setDisplayedModules(databaseModules.filter(moduleInfo => {
            const normalizedQuery: string = query.trim().toLowerCase();

            // search through name, module-id, author, and tags
            const includedFields: (keyof ModuleInfo)[] = ["name", "module-id", "author"];

            for (const field of includedFields) {
                if (typeof moduleInfo[field] === "string" && moduleInfo[field].toLowerCase().trim().includes(normalizedQuery)) {
                    return true;
                }
            }
            for (const tag of moduleInfo.tags ?? []) {
                if (tag.toLowerCase().trim().includes(normalizedQuery)) {
                    return true;
                }
            }
            return false;
        }))


    }
    useEffect(() => {
        if (searchBarRef.current) {
            searchBarRef.current.value = query;
        }
        searchForModule();
    }, [query, queryKey]);


    return <div className={styles["page"]}>
        <MarketplaceHeader />
        <br />
        <VerticalSpacer size="4rem" />

        {
            isLoading ? <div className={styles["centered"]}><Spinner /></div> :

                <div className={styles["body"]}>
                    <h2>All Modules</h2>

                    <div className={styles["search-container"]}>
                        <div className={styles['searchbar']}>
                            <div style={{ position: "relative" }}>
                                <input
                                    ref={searchBarRef}
                                    type="text"
                                    onKeyDown={({ key }) => key === "Enter" && searchForModule()}
                                />
                                <p key={queryKey} onClick={() => { setQuery(''); setQueryKey(prev => prev + 1) }} className={styles["clear-search"]}>x</p>

                            </div>

                            <HorizontalSpacer size="1rem" />
                            <button onClick={() => searchForModule()}>Search</button>
                        </div>

                        <div className={styles["remove-mobile"]} style={{ marginRight: "auto" }}></div>
                        <div className={styles["sort-container"]}>
                            <p>Sort By:</p>

                            <HorizontalSpacer size="0.5rem" />

                            <select value={selectedSort} onChange={(event) => setSelectedSort(event.target.value)}>
                                {Object.keys(SORT_OPTIONS).map(value =>
                                    <option key={value} value={value}>{SORT_OPTIONS[value]}</option>
                                )}
                            </select>
                        </div>

                    </div>
                    <VerticalSpacer size={"0.25rem"} />
                    <p style={{ fontSize: "0.75rem", color: "gray" }}>Search by tag, name, module ID, or author.</p>

                    <VerticalSpacer size={"1rem"} />

                    <div className={styles["module-container"]}>
                        {displayedModules.sort((a, b) => sortFunction(selectedSort, a, b)).map((moduleInfo, index) =>
                            <Module
                                key={index}
                                sortState={selectedSort}
                                setQuery={setQuery}
                                moduleInfo={moduleInfo} />)}

                    </div>

                    <VerticalSpacer size="4rem" />


                </div>
        }


    </div>

}




interface ModuleProps {
    moduleInfo: ModuleInfo;
    sortState: string;
    setQuery: (s: string) => void;
}

function Module({ moduleInfo, setQuery, sortState }: ModuleProps) {
    const modulePageLink: string = `/marketplace/${moduleInfo["_id"]}`;

    return <div className={styles["module"]}>
        <div className={styles["module-image-container"] + " " + styles["clickable"]}>
            {moduleInfo.image
                ? <a href={modulePageLink}><img src={moduleInfo.image} alt="icon" loading="lazy" /></a>
                : <a href={modulePageLink} className={styles["module-abbreviation"]}>{getAbbreviation(moduleInfo.name)}</a>}
        </div>

        <div className={styles["module-info-container"]}>
            <h3 className={`${styles["clickable-text"]}`}><a href={modulePageLink}>{moduleInfo.name}</a></h3>
            <h4 className={styles["clickable-text"]} onClick={() => setQuery(moduleInfo.author)}>{moduleInfo.author}</h4>
            {moduleInfo.description && <h4 className={styles['desc']}>{moduleInfo.description}</h4>}

            <div className={styles["tag-container"]}>
                {moduleInfo.tags && moduleInfo.tags.slice(0, 3).map(tag => <p onClick={() => setQuery(tag)} className={styles["clickable-text"]} key={tag}>{tag}</p>)}
            </div>

            <VerticalSpacer size="0.25rem" />


            <div className={styles["extra-info-wrapper"]}>
                <div className={styles["info-left"]}>
                    <p className={styles["likes"]}>
                        <span></span>
                        {moduleInfo.metadata["like-count"]}
                    </p>
                    <p className={styles["downloads"]}>
                        <span></span>
                        {moduleInfo.metadata["download-count"]}
                    </p>
                </div>
                <div className={styles["info-right"]}>
                    {sortState.startsWith("upload")
                        ? <p>Uploaded {moduleInfo.metadata["date-uploaded"]?.toLocaleString()}</p>
                        : <p>Modified {moduleInfo.metadata["date-modified"]?.toLocaleString()}</p>
                    }
                </div>

            </div>



        </div>

    </div>
}
