"use client";

import { SessionContextValue } from "next-auth/react"
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../../../../components/Components";
import { getAbbreviation } from "../../../../utils/utils";
import { ModuleInfo, UserBookmarkInfo } from "../../../types";
import styles from "./styles.module.css";
import globalStyles from "../../globals.module.css";
import { removeBookmarkedModule } from "../../../server/module-database/bookmarks";
import { useState } from "react";


interface Props {
    session: SessionContextValue;
    bookmarks: (ModuleInfo & { bookmarkInfo: UserBookmarkInfo })[] | undefined;
    setNotificationText: (message: string) => void;
    triggerRefresh: () => void;
}


const sortFunction = (a: ModuleInfo & { bookmarkInfo: UserBookmarkInfo }, b: ModuleInfo & { bookmarkInfo: UserBookmarkInfo }) => {
    return a.bookmarkInfo["bookmarked-at"] < b.bookmarkInfo["bookmarked-at"] ? 1 : -1
}

export default function BookmarksPage(props: Props) {
    const removeBookmark = ((moduleInfo: ModuleInfo) => {
        removeBookmarkedModule(moduleInfo._id).then(result => {
            if (typeof result === "string") {
                props.setNotificationText(result);
                return;
            }
            props.setNotificationText(`Successfully unsaved ${moduleInfo.name}`);
            props.triggerRefresh();
        })
    })
    return <>
        <h2>Saved Modules</h2>
        <VerticalSpacer size="1rem" />
        {
            !props.bookmarks ? <Spinner /> : <>
                {props.bookmarks.length === 0 &&
                    <p>No modules saved; visit the <a style={{ color: "var(--accent-color)" }} href="/marketplace">Marketplace</a> to find some.</p>
                }
                <div className={styles["module-container"]}>

                    {props.bookmarks && props.bookmarks.sort(sortFunction).map(moduleInfo =>
                        <Module removeBookmark={removeBookmark} key={moduleInfo._id} moduleInfo={moduleInfo} />
                    )}
                </div>
            </>
        }
    </>
}

interface ModuleInfoProps {
    moduleInfo: ModuleInfo & { bookmarkInfo: UserBookmarkInfo };
    removeBookmark: (moduleInfo: ModuleInfo) => void;

}
function Module({ moduleInfo, removeBookmark }: ModuleInfoProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const modulePageLink: string = `/marketplace/${moduleInfo["_id"]}`;

    return <div className={styles["module"]}>
        {isLoading ? <div className={styles["spinner-container"]}><Spinner /></div> : <>

            <div className={styles["title"]}>
                <div className={styles["image"]}>
                    {moduleInfo.image
                        ? <img src={moduleInfo.image} alt="Module Icon" loading="lazy"/>
                        : <p className="module-abbreviation">{getAbbreviation(moduleInfo.name)}</p>}
                </div>
                <div className={styles["module-info"]}>
                    <h1><a href={modulePageLink}>{moduleInfo.name}</a></h1>
                    <h2>{moduleInfo["module-id"]}</h2>
                </div>
            </div>

            <VerticalSpacer size={"0.5rem"} />
            <div className={styles["tag-container"]}>
                {moduleInfo.tags?.slice(0, 3).map(tag => <p key={tag}>{tag}</p>)}
            </div>
            <VerticalSpacer size={"0.5rem"} />


            <div className={styles["button-container"]}>
                <HorizontalSpacer />
                <button
                    className={globalStyles["button"]}
                    onClick={() => { setIsLoading(true); removeBookmark(moduleInfo) }}
                >
                    Unsave
                </button>
            </div>


            <div className={styles["extra-info-wrapper"]}>
                <div className={styles["info-left"]}>
                    <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                    <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                </div>
                <div className={styles["info-right"]}>
                    <p>Saved on {moduleInfo.bookmarkInfo["bookmarked-at"].toLocaleString()}</p>
                </div>
            </div>
        </>}


    </div>
}