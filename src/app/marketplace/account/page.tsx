"use client"

import { SessionContextValue, useSession } from "next-auth/react";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../../components/Components";
import MarketplaceHeader from "../MarketplaceHeader";
import styles from "./account.module.css"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { getAbbreviation } from "../../utils/utils";
import { ModuleInfo, UserBookmarkInfo, UserLikedInfo } from "../types";
import ProfilePage from "./components/profile/ProfilePage";
import LikedPage from "./components/likes/LikedPage";
import BookmarksPage from "./components/bookmarks/BookmarksPage";
import { getLikedModulesForUser } from "../server/module-database/likes";
import { getModulesFromUser, deleteRemoteModule } from "../server/module-database/modules";
import { getBookmarkedModules } from "../server/module-database/bookmarks";

const ALERT_CLEAR_SEC: number = 2;

interface AlertProps {
    textInfo: { text: string, id: number };

}

function Alert(props: AlertProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!props.textInfo.text) return;

        setVisible(true);
        const timeout = setTimeout(() => {
            setVisible(false);
        }, ALERT_CLEAR_SEC * 1000);

        return () => clearTimeout(timeout);
    }, [props.textInfo.id]);

    return (
        <div
            className={styles["notification"]}
            style={{ opacity: visible ? '1' : '0' }}
        >
            <p>{props.textInfo.text}</p>
        </div>
    );
}



const TABS: { [tab: string]: string } = {
    ACCOUNT: "Account",
    SAVED: "Saved",
    LIKES: 'Likes',
}


export default function AccountPage() {


    const router = useRouter();
    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/marketplace/login");
        },
    });
    const notificationHelper = useCallback((message: string) => setNotificationText({ text: message, id: Date.now() }), []);

    const [likedModules, setLikedModules] = useState<(ModuleInfo & { likeInfo: UserLikedInfo })[] | undefined>(undefined);
    const [bookmarkedModules, setBookmarkedModules] = useState<(ModuleInfo & { bookmarkInfo: UserBookmarkInfo })[] | undefined>(undefined);

    useEffect(() => {
        getLikedModulesForUser().then(result => {
            if (typeof result === "string") {
                notificationHelper(result);
                return;
            }
            setLikedModules(result);
        });

        getBookmarkedModules().then(result => {
            if (typeof result === "string") {
                notificationHelper(result);
                return;
            }
            setBookmarkedModules(result);
        });
    }, [])

    const [selectedTab, setSelectedTab] = useState<string>(Object.values(TABS)[0])
    const [notificationText, setNotificationText] = useState<{ text: string, id: number }>({ text: '', id: 0 });
    const [editTarget, setEditTarget] = useState<ModuleInfo | null | undefined>(undefined);

    const editModule = useCallback((module: ModuleInfo | null | undefined) => {
        setEditTarget(module);
    }, [])


    const onTabPressed = (tabName: string) => {
        setSelectedTab(tabName);
    }

    return <>
        <MarketplaceHeader />
        <VerticalSpacer size={"4rem"} />

        <div className={styles["account-body"]}>

            <div className={styles.left}>
                {Object.keys(TABS).map(tabName =>
                    <p
                        style={selectedTab === TABS[tabName] ? { borderColor: "var(--accent-color)", color: "var(--accent-color)" } : {}}
                        key={tabName}
                        onClick={() => onTabPressed(TABS[tabName])}
                    >
                        {selectedTab === TABS[tabName] ? "> " : " "}{TABS[tabName]}
                    </p>
                )}
            </div>

            <div className={styles.right}>
                {(() => {
                    switch (selectedTab) {
                        case TABS.ACCOUNT: return <ProfilePage setNotificationText={notificationHelper} session={session} />
                        case TABS.LIKES: return <LikedPage likedModules={likedModules} setNotificationText={notificationHelper} session={session} />
                        case TABS.SAVED: return <BookmarksPage bookmarks={bookmarkedModules} setNotificationText={notificationHelper} session={session} />
                        default: return undefined;
                    }
                })()}

                {/* {editTarget !== undefined
                    ? <EditModuleScreen setNotificationText={notificationHelper} editModule={editModule} editTarget={editTarget} session={session} />
                    : <ModuleListScreen setNotificationText={notificationHelper} editModule={editModule} session={session} />
                } */}

            </div>
        </div>


        <div className={styles["notification-container"]}>
            <Alert textInfo={notificationText} />
        </div>
    </>
}


interface ModuleListScreenProps {
    session: SessionContextValue;
    editModule: (module: ModuleInfo | null | undefined) => void;
    setNotificationText: (message: string) => void;

}

function ModuleListScreen({ session, editModule, setNotificationText }: ModuleListScreenProps) {
    const [uploadedModules, setUploadedModules] = useState<ModuleInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false)

    useEffect(() => {
        if (session.status === "authenticated") {
            getModulesFromUser(session.data.user.id).then((result) => {
                setUploadedModules(result ?? [])
                setIsLoading(false);
            });
        }
    }, [session, triggerRefresh]);


    const deleteModule = (moduleInfo: ModuleInfo) => {
        deleteRemoteModule(moduleInfo).then((result: string | undefined) => {
            if (result === undefined) {
                setNotificationText(`Successfully deleted ${moduleInfo["module-id"]}`)
                setTriggerRefresh(prev => !prev);
            } else {
                setNotificationText(`Could not delete ${moduleInfo["module-id"]}; ${result}`);
            }
        })
    }

    return <>
        <div className={styles.header}>
            <h1>Your Modules</h1>
            <HorizontalSpacer />
            <button className={styles["button"]} onClick={() => editModule(null)}>
                + Upload Module
            </button>
            <HorizontalSpacer size="1rem" />


        </div>
        {
            session.status === "loading" || isLoading
                ? <div className={styles["spinner-container"]}>
                    <Spinner />
                </div>

                : <>
                    <VerticalSpacer size={"1rem"} />
                    <div className={styles["module-container"]}>
                        {
                            uploadedModules.map((module, index) =>
                                <React.Fragment key={index}>
                                    <Module deleteModule={deleteModule} editModule={editModule} moduleInfo={module} />
                                    <VerticalSpacer size={"1rem"} />
                                </React.Fragment>
                            )
                        }
                        {
                            uploadedModules.length === 0 && <>
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
    deleteModule: (moduleInfo: ModuleInfo) => void;
    editModule: (module: ModuleInfo | null | undefined) => void;
}


function Module({ moduleInfo, editModule, deleteModule }: ModuleProps) {
    const [deleteButtonPressCount, setDeleteButtonPressCount] = useState<number>(0);
    const [deleteDebounce, setDeleteDebounce] = useState<NodeJS.Timeout | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        clearTimeout(deleteDebounce);

        if (deleteButtonPressCount >= 2) {
            setIsLoading(true);
            deleteModule(moduleInfo)
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
                            <div className={styles["tag-box"]}>
                                {moduleInfo.tags?.slice(0, 3).map(tag => <p key={tag} className={styles["tag"]}>{tag}</p>)}

                            </div>
                        </div>

                    </div>

                    <VerticalSpacer size={"0.5rem"} />
                    <div className={styles['metadata-container']}>
                        <p className={styles["likes"]}><span></span>{moduleInfo.metadata["like-count"]}</p>
                        <p className={styles["downloads"]}><span></span>{moduleInfo.metadata["download-count"]}</p>
                    </div>
                    <VerticalSpacer size={"0.5rem"} />

                    <div className={styles["button-container"]}>
                        <a href={`/marketplace/${moduleInfo["_id"]}`}>
                            View
                        </a>
                        <HorizontalSpacer size="1rem" />
                        <button className={styles["button"]} onClick={() => editModule(moduleInfo)}>
                            Edit
                        </button>

                        <HorizontalSpacer />

                        <button className={styles["button"]} style={{ backgroundColor: deleteButtonPressCount > 0 ? "red" : "" }} onClick={() => setDeleteButtonPressCount(prev => prev + 1)}>
                            {deleteButtonPressCount > 0 ? "Confirm Delete" : "Delete"}
                        </button>

                    </div>


                </>
        }

    </div>
}