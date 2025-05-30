"use client"

import { Ref, useEffect, useRef, useState } from "react";
import styles from "./marketplace.module.css"
import { getAllRemoteModules, ModuleInfo } from "./module-database";
import { getAbbreviation } from "../utils/utils";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../components/Components";
import MarketplaceHeader from "./MarketplaceHeader";


export default function NexusMarket() {

    const searchBarRef: Ref<HTMLInputElement> = useRef(null);

    const [query, setQuery] = useState<string>('');
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
    }, [query])


    return <div className={styles["page"]}>
        <MarketplaceHeader />
        <br />
        <VerticalSpacer size="4rem" />


        {
            isLoading ? <div className={styles["centered"]}><Spinner /></div> :

                <div className={styles["body"]}>

                    <div className={styles["right"]}>
                        <h2>All Modules</h2>

                        <div className={styles["inline"]}>
                            <div>
                                <div className={styles["searchbar"]}>
                                    <input
                                        ref={searchBarRef}
                                        type="text"
                                        onKeyDown={({ key }) => key === "Enter" && searchForModule()}
                                    />
                                    <p onClick={() => setQuery('')} className={styles["clear-search"]}>x</p>
                                </div>

                                <VerticalSpacer size={"0.25rem"} />
                                <p style={{ fontSize: "0.75rem" }}>Search by tag, name, module ID, or author</p>

                            </div>

                            <HorizontalSpacer size="1rem" />
                            <button onClick={() => searchForModule()}>Search</button>
                        </div>

                        <VerticalSpacer size={"1rem"} />

                        <div id={styles["module-container"]}>
                            {displayedModules.map((moduleInfo, index) =>
                                <Module
                                    key={index}
                                    setQuery={setQuery}
                                    moduleInfo={moduleInfo} />)}

                        </div>

                        <VerticalSpacer size="4rem" />

                    </div>

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
        </div>

    </div>
}