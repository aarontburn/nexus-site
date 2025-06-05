"use client";

import { SessionContextValue } from "next-auth/react"
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../../../../components/Components";
import { getAbbreviation } from "../../../../utils/utils";
import { ModuleInfo } from "../../../types";
import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";




interface ModuleListScreenProps {
    session: SessionContextValue;
    uploads: ModuleInfo[] | undefined;
    setNotificationText: (message: string) => void;
}

const sort = (a: ModuleInfo, b: ModuleInfo) => {
    return a.metadata["date-modified"] > b.metadata["date-modified"] ? -1 : 1
}


export default function UploadsPage(props: ModuleListScreenProps) {
    return <>
        <div className={styles.header}>
            <h2>Your Modules</h2>
            <HorizontalSpacer />
            <button className={styles["button"]} onClick={() => { }}>
                + Upload Module
            </button>
            <HorizontalSpacer size="1rem" />
        </div>
        {
            props.uploads === undefined
                ? <div className={styles["spinner-container"]}>
                    <Spinner />
                </div>

                : <>
                    <VerticalSpacer size={"1rem"} />
                    <div className={styles["module-container"]}>
                        {
                            props.uploads?.sort(sort).map((module, index) =>
                                <React.Fragment key={index}>
                                    <Module moduleInfo={module} />
                                </React.Fragment>
                            )
                        }
                        {
                            props.uploads?.length === 0 && <>
                                <p>No modules found.</p>
                            </>
                        }

                    </div>
                    <VerticalSpacer size={"1rem"} />

                </>

        }
    </>
}

interface ModuleProps {
    moduleInfo: ModuleInfo;
    // deleteModule: (moduleInfo: ModuleInfo) => void;
    // editModule: (module: ModuleInfo | null | undefined) => void;
}


function Module({ moduleInfo }: ModuleProps) {
    const [deleteButtonPressCount, setDeleteButtonPressCount] = useState<number>(0);
    const [deleteDebounce, setDeleteDebounce] = useState<NodeJS.Timeout | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        clearTimeout(deleteDebounce);

        if (deleteButtonPressCount >= 2) {
            setIsLoading(true);
            // deleteModule(moduleInfo)
            return;
        }

        const timeout = setTimeout(() => {
            setDeleteButtonPressCount(0);
        }, 2000);

        setDeleteDebounce(timeout);
        return () => clearTimeout(timeout);
    }, [deleteButtonPressCount]);


    return <div className={styles["module"]}>
        {
            isLoading ? <div className={styles["spinner-container-2"]}>
                <Spinner />
            </div>
                : <>
                    <div className={styles["title"]}>
                        <div className={styles["image"]}>
                            {moduleInfo.image
                                ? <img src={moduleInfo.image} alt="Module Icon" />
                                : <p className="module-abbreviation">{getAbbreviation(moduleInfo.name)}</p>}
                        </div>
                        <div className={styles["module-info"]}>
                            <h1>{moduleInfo.name}</h1>
                            <h2>{moduleInfo["module-id"]}</h2>
                        </div>
                    </div>

                    <VerticalSpacer size={"0.25rem"} />

                    <div className={styles["button-container"]}>
                        <a className={styles["button"]} href={`/marketplace/${moduleInfo["_id"]}`}>
                            View
                        </a>
                        <HorizontalSpacer size="1rem" />
                        <button className={styles["button"]} onClick={() => { }}>
                            Edit
                        </button>

                        <HorizontalSpacer />

                        <button className={styles["button"]} style={{ backgroundColor: deleteButtonPressCount > 0 ? "red" : "" }} onClick={() => setDeleteButtonPressCount(prev => prev + 1)}>
                            {deleteButtonPressCount > 0 ? "Confirm Delete" : "Delete"}
                        </button>
                    </div>


                    <div className={styles["extra-info-wrapper"]}>
                        <div className={styles["info-left"]}>
                            <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                            <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                        </div>
                        <div className={styles["info-right"]}>
                            <p>Modified on {moduleInfo.metadata["date-modified"].toLocaleString()}</p>
                        </div>
                    </div>



                </>
        }

    </div>
}