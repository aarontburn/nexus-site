"use client"

import { Ref, useEffect, useRef, useState } from "react";
import styles from "./marketplace.module.css"
import { getAllRemoteModules, ModuleInfo } from "./module-database";
import { getAbbreviation } from "../utils/utils";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../components/Components";
import MarketplaceHeader from "./MarketplaceHeader";

const SORT_OPTIONS: { [value: string]: string } = {
    "name-descend": 'Name (A - Z)',
    "name-ascend": 'Name (Z  - A)',
    "upload-descend": 'Date Uploaded (New - Old)',
    "upload-ascend": 'Date Uploaded (Old - New)',
    "modified-descend": 'Date Modified (New - Old)',
    "modified-ascend": 'Date Modified (Old - New)',
}


export default function NexusMarket() {

    const searchBarRef: Ref<HTMLInputElement> = useRef(null);

    const [query, setQuery] = useState<string>('');
    const [queryKey, setQueryKey] = useState<number>(0);
    const [selectedSort, setSelectedSort] = useState<string>(Object.keys(SORT_OPTIONS)[0]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    useEffect(() => {
        console.log(selectedSort)
    }, [selectedSort]);


    return <div className={styles["page"]}>
        <MarketplaceHeader />
        <br />
        <VerticalSpacer size="4rem" />


        {
            isLoading ? <div className={styles["centered"]}><Spinner /></div> :

                <div className={styles["body"]}>




                    <h2>All Modules</h2>

                    <div className={styles["inline"]}>
                        <div className={styles["searchbar"]}>
                            <input
                                ref={searchBarRef}
                                type="text"
                                onKeyDown={({ key }) => key === "Enter" && searchForModule()}
                            />
                            <p key={queryKey} onClick={() => { setQuery(''); setQueryKey(prev => prev + 1) }} className={styles["clear-search"]}>x</p>
                        </div>


                        <HorizontalSpacer size="1rem" />
                        <button onClick={() => searchForModule()}>Search</button>

                        <HorizontalSpacer size="auto" />
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
                    <p style={{ fontSize: "0.75rem" }}>Search by tag, name, module ID, or author</p>

                    <VerticalSpacer size={"1rem"} />

                    <div id={styles["module-container"]}>
                        {displayedModules.sort((a: ModuleInfo, b: ModuleInfo) => {
                            if (!a["date-modified"] || !a["date-uploaded"]) {
                                console.warn(`${a["module-id"]} has no date set.`);
                                return 0;
                            }

                            if (!b["date-modified"] || !b["date-uploaded"]) {
                                console.warn(`${b["module-id"]} has no date set.`)
                                return 1;
                            }

                            switch (selectedSort) {
                                case "name-descend": {
                                    return a.name.localeCompare(b.name);
                                }
                                case "name-ascend": {
                                    return b.name.localeCompare(a.name);
                                }
                                case "upload-descend": {
                                    if (a["date-uploaded"]?.getTime() === b["date-uploaded"]?.getTime()) {
                                        return 0;
                                    }

                                    return a["date-uploaded"] < b["date-uploaded"] ? 1 : -1;
                                }
                                case "upload-ascend": {
                                    if (a["date-uploaded"]?.getTime() === b["date-uploaded"]?.getTime()) {
                                        return 0;
                                    }

                                    return b["date-uploaded"] < a["date-uploaded"] ? 1 : -1;
                                }
                                case "modified-descend": {
                                    if (a["date-modified"]?.getTime() === b["date-modified"]?.getTime()) {
                                        return 0;
                                    }

                                    return a["date-modified"] < b["date-modified"] ? 1 : -1;
                                }
                                case "modified-ascend": {
                                    if (a["date-modified"]?.getTime() === b["date-modified"]?.getTime()) {
                                        return 0;
                                    }

                                    return b["date-modified"] < a["date-modified"] ? 1 : -1;
                                }
                            }
                            return a.name.localeCompare(b.name);

                        }).map((moduleInfo, index) =>
                            <Module
                                key={index}
                                setQuery={setQuery}
                                moduleInfo={moduleInfo} />)}

                    </div>

                    <VerticalSpacer size="4rem" />


                </div>
        }


    </div>

}





function Module({ moduleInfo, setQuery }: { moduleInfo: ModuleInfo, setQuery: (s: string) => void }) {
    const modulePageLink: string = `/marketplace/${moduleInfo["_id"]}`
    return <div className={styles["module"]}>
        <div className={styles["module-image-container"] + " " + styles["clickable"]}>
            {moduleInfo.image
                ? <a href={modulePageLink}><img src={moduleInfo.image} alt="icon" /></a>
                : <a href={modulePageLink} className={styles["module-abbreviation"]}>{getAbbreviation(moduleInfo.name)}</a>}
        </div>

        <div className={styles["module-info-container"]}>
            <h3 className={`${styles["module-info-name"]} ${styles["clickable-text"]}`}><a href={modulePageLink}>{moduleInfo.name}</a></h3>
            <h4 className={styles["clickable-text"]} onClick={() => setQuery(moduleInfo.author)}>{moduleInfo.author}</h4>
            {moduleInfo.description && <h4 className={styles['desc']}>{moduleInfo.description}</h4>}

            <div className={styles["tag-container"]}>
                {moduleInfo.tags && moduleInfo.tags.slice(0, 3).map(tag => <p onClick={() => setQuery(tag)} className={styles["clickable-text"]} key={tag}>{tag}</p>)}
            </div>
            {/* Maybe show the date if the filter is on date-upload or date-modified? */}
        </div>

    </div>
}