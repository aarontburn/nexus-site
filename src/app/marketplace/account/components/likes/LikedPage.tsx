"use client";

import { SessionContextValue } from "next-auth/react"
import { ModuleInfo, UserLikedInfo } from "../../../types";
import styles from "./styles.module.css";
import globalStyles from "../../globals.module.css";
import { getAbbreviation } from "../../../../utils/utils";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../../../../components/Components";
import { removeModuleLike } from "../../../server/module-database/likes";
import { useState } from "react";

interface Props {
    session: SessionContextValue;
    likedModules: (ModuleInfo & { likeInfo: UserLikedInfo })[] | undefined;
    setNotificationText: (message: string) => void;
    triggerRefresh: () => void;
}

const sortFunction = (a: ModuleInfo & { likeInfo: UserLikedInfo }, b: ModuleInfo & { likeInfo: UserLikedInfo }) => {
    return a.likeInfo["liked-at"] < b.likeInfo["liked-at"] ? 1 : -1
}

export default function LikedPage(props: Props) {
    const unlikeModule = ((moduleInfo: ModuleInfo) => {
        removeModuleLike(moduleInfo._id).then(result => {
            if (typeof result === "string") {
                props.setNotificationText(result);
                return;
            }
            props.setNotificationText(`Successfully removed like from ${moduleInfo.name}`);
            props.triggerRefresh();
        })
    })

    return <>
        <h2>Liked Modules</h2>
        <VerticalSpacer size="1rem" />

        {
            !props.likedModules ? <Spinner /> : <>
                {props.likedModules.length === 0 &&
                    <p>No modules liked; visit the <a style={{ color: "var(--accent-color)" }} href="/marketplace">Marketplace</a> to find some.</p>
                }
                <div className={styles["module-container"]}>
                    {props.likedModules && props.likedModules.sort(sortFunction).map(moduleInfo =>
                        <Module unlikeModule={unlikeModule} key={moduleInfo._id} moduleInfo={moduleInfo} />
                    )}
                </div>
            </>
        }
    </>
}

interface ModuleInfoProps {
    moduleInfo: (ModuleInfo & { likeInfo: UserLikedInfo });
    unlikeModule: (moduleInfo: ModuleInfo) => void;
}

function Module({ moduleInfo, unlikeModule }: ModuleInfoProps) {
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
                    <h2 style={{color: "gray"}}>{moduleInfo.author}</h2>

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
                    onClick={() => { setIsLoading(true); unlikeModule(moduleInfo) }}
                >
                    Unlike
                </button>
            </div>


            <div className={styles["extra-info-wrapper"]}>
                <div className={styles["info-left"]}>
                    <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                    <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                </div>
                <div className={styles["info-right"]}>
                    <p>Liked on {moduleInfo.likeInfo["liked-at"].toLocaleString()}</p>
                </div>
            </div>
        </>
        }

    </div>
}