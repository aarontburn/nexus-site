"use client"

import { Ref, useEffect, useRef, useState } from "react";
import styles from "./marketplace.module.css"
import { getAllRemoteModules, ModuleInfo } from "./NexusDatabase";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getAbbreviation } from "../utils/utils";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../components/Components";
import MarketplaceHeader from "./MarketplaceHeader";


export default function NexusMarket() {

    const searchBarRef: Ref<HTMLInputElement> = useRef(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>()
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
            const includedFields: (keyof ModuleInfo)[] = ["name", "module-id", "author"];

            for (const field of includedFields) {
                if (typeof moduleInfo[field] === "string" && moduleInfo[field].toLowerCase().includes(query)) {
                    return true;
                }
            }
            return false;
        }))


    }

    return <div className={styles["page"]}>
        <MarketplaceHeader />
        <VerticalSpacer size={"5rem"} />

        {
            isLoading ? <div className={styles["centered"]}><Spinner /></div> :
                <div className={styles["body"]}>
                    <div className={styles["left"]}>
                        <h2>Filters</h2>

                    </div>

                    <div className={styles["right"]}>
                        <h2>All Modules</h2>

                        <div className={styles["inline"]}>
                            <div>
                                <input
                                    ref={searchBarRef}
                                    type="text"
                                    onKeyDown={({ key }) => key === "Enter" && searchForModule()}
                                />
                                <VerticalSpacer size={"0.25rem"} />
                                <p style={{fontSize: "0.75rem"}}>Search by name, module ID, or author</p>

                            </div>

                            <HorizontalSpacer size="1rem" />
                            <button onClick={() => searchForModule()}>Search</button>
                        </div>

                        <VerticalSpacer size={"0.5rem"} />


                        <div id={styles["module-container"]}>
                            {displayedModules.map((moduleInfo, index) => <Module key={index} moduleInfo={moduleInfo} />)}

           

                        </div>
                    </div>
                </div>
        }


    </div>

}




function Module({ moduleInfo }: { moduleInfo: ModuleInfo }) {
    const router: AppRouterInstance = useRouter();
    const onClick = () => router.push(`/marketplace/${moduleInfo["_id"]}`);

    return <div className={styles["module"]}>
        <div className={styles["module-image-container"] + " " + styles["clickable"]} onClick={onClick}>
            {moduleInfo.image
                ? <img src={moduleInfo.image} alt="icon" />
                : <p className={styles["module-abbreviation"]}>{getAbbreviation(moduleInfo.name)}</p>}

        </div>
        <div className={styles["module-info-container"]}>
            <h3 onClick={onClick} className={`${styles["module-info-name"]} ${styles["clickable"]}`}>{moduleInfo.name}</h3>
            <h4 onClick={() => {/* Set filter to be just the author*/ }}>{moduleInfo.author}</h4>
            {moduleInfo.description && <h4>{moduleInfo.description}</h4>}
        </div>

    </div>
}