"use client";

import { SessionContextValue } from "next-auth/react"
import { Spinner, VerticalSpacer } from "../../../../components/Components";
import { getAbbreviation } from "../../../../utils/utils";
import { ModuleInfo, UserBookmarkInfo } from "../../../types";
import styles from "./styles.module.css";


interface Props {
    session: SessionContextValue;
    bookmarks: (ModuleInfo & { bookmarkInfo: UserBookmarkInfo })[] | undefined;
    setNotificationText: (message: string) => void;
}


const sortFunction = (a: ModuleInfo & { bookmarkInfo: UserBookmarkInfo }, b: ModuleInfo & { bookmarkInfo: UserBookmarkInfo }) => {
    return a.bookmarkInfo["bookmarked-at"] < b.bookmarkInfo["bookmarked-at"] ? 1 : -1
}

export default function BookmarksPage(props: Props) {
    return <>
        <h2>Saved Modules</h2>
        <VerticalSpacer size="1rem" />
        {
            !props.bookmarks ? <Spinner /> :
                <div className={styles["module-container"]}>
                    {props.bookmarks && props.bookmarks.sort(sortFunction).map(moduleInfo =>
                        <Module key={moduleInfo._id} moduleInfo={moduleInfo} />
                    )}
                </div>
        }
    </>
}

interface ModuleInfoProps {
    moduleInfo: ModuleInfo & { bookmarkInfo: UserBookmarkInfo };
}
function Module({ moduleInfo }: ModuleInfoProps) {
    const modulePageLink: string = `/marketplace/${moduleInfo["_id"]}`
    return <div className={styles["module"]}>
        <div className={styles["module-image-container"] + " " + styles["clickable"]}>
            {moduleInfo.image
                ? <a href={modulePageLink}><img src={moduleInfo.image} alt="icon" /></a>
                : <a href={modulePageLink} className={styles["module-abbreviation"]}>{getAbbreviation(moduleInfo.name)}</a>}
        </div>

        <div className={styles["module-info-container"]}>
            <h3 className={`${styles["clickable-text"]}`}><a href={modulePageLink}>{moduleInfo.name}</a></h3>
            <h4 className={styles["clickable-text"]}>{moduleInfo.author}</h4>
            {moduleInfo.description && <h4 className={styles['desc']}>{moduleInfo.description}</h4>}

            <VerticalSpacer size="0.25rem" />


            <div className={styles["extra-info-wrapper"]}>
                <div className={styles["info-left"]}>
                    <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                    <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                </div>
                <div className={styles["info-right"]}>
                    <p>Saved on {moduleInfo.bookmarkInfo["bookmarked-at"].toLocaleString()}</p>
                </div>

            </div>



        </div>

    </div>
}