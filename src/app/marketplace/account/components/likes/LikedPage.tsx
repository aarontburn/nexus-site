"use client";

import { SessionContextValue } from "next-auth/react"
import { ModuleInfo, UserLikedInfo } from "../../../types";
import styles from "./styles.module.css";
import { getAbbreviation } from "../../../../utils/utils";
import { Spinner, VerticalSpacer } from "../../../../components/Components";

interface Props {
    session: SessionContextValue;
    likedModules: (ModuleInfo & { likeInfo: UserLikedInfo })[] | undefined;
    setNotificationText: (message: string) => void;
}

const sortFunction = (a: ModuleInfo & { likeInfo: UserLikedInfo }, b: ModuleInfo & { likeInfo: UserLikedInfo }) => {
    return a.likeInfo["liked-at"] < b.likeInfo["liked-at"] ? 1 : -1
}

export default function LikedPage(props: Props) {
    return <>
        <h2>Liked Modules</h2>
        <VerticalSpacer size="1rem" />

        {
            !props.likedModules ? <Spinner /> :
                <div className={styles["module-container"]}>
                    {props.likedModules && props.likedModules.sort(sortFunction).map(moduleInfo =>
                        <Module key={moduleInfo._id} moduleInfo={moduleInfo} />
                    )}
                </div>
        }
    </>
}

interface ModuleInfoProps {
    moduleInfo: (ModuleInfo & { likeInfo: UserLikedInfo });
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

            <div className={styles["tag-container"]}>
                {moduleInfo.tags && moduleInfo.tags.slice(0, 3).map(tag => <p className={styles["clickable-text"]} key={tag}>{tag}</p>)}
            </div>

            <VerticalSpacer size="0.25rem" />


            <div className={styles["extra-info-wrapper"]}>
                <div className={styles["info-left"]}>
                    <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                    <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                </div>
                <div className={styles["info-right"]}>
                    <p>Liked on {moduleInfo.likeInfo["liked-at"].toLocaleString()}</p>
                </div>

            </div>



        </div>

    </div>
}