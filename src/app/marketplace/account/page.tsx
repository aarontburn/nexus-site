"use client"

import { useSession } from "next-auth/react";
import { VerticalSpacer } from "../../components/Components";
import MarketplaceHeader from "../MarketplaceHeader";
import styles from "./account.module.css";
import globalStyles from "./globals.module.css"

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { ModuleInfo, UserBookmarkInfo, UserLikedInfo } from "../types";
import LikedPage from "./components/likes/LikedPage";
import BookmarksPage from "./components/bookmarks/BookmarksPage";
import { getLikedModulesForUser } from "../server/module-database/likes";
import { getUploadedModules } from "../server/module-database/modules";
import { getBookmarkedModules } from "../server/module-database/bookmarks";
import UploadsPage from "./components/uploads/UploadsPage";

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
    SAVED: "Saved",
    LIKES: 'Liked',
    UPLOAD: "Uploaded"
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
    const [uploadedModules, setUploadedModules] = useState<ModuleInfo[] | undefined>(undefined);
    const [refreshModules, triggerModuleRefresh] = useState<number>(0);


    useEffect(() => {
        setLikedModules(undefined)
        setBookmarkedModules(undefined)
        setUploadedModules(undefined)

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

        getUploadedModules().then(result => {
            if (typeof result === "string") {
                notificationHelper(result);
                return;
            }
            setUploadedModules(result);
        });


    }, [refreshModules])

    const [selectedTab, setSelectedTab] = useState<string>(Object.values(TABS)[0])
    const [notificationText, setNotificationText] = useState<{ text: string, id: number }>({ text: '', id: 0 });


    const onTabPressed = (tabName: string) => {
        setSelectedTab(tabName);
    }

    return <>
        <MarketplaceHeader />
        <VerticalSpacer size={"4rem"} />

        <div className={styles["account-body"]}>

            <div className={styles.left}>


                <div className={styles["sidebar-buttons"]}>
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

                <VerticalSpacer />

                <div className={styles["user-info"]}>
                    <p className={styles["user-info-section"]}>Username</p>
                    <p>{session.data?.user.name}</p>

                    <VerticalSpacer size="1rem" />

                    <p className={styles["user-info-section"]}>Email</p>
                    <p>{session.data?.user.email}</p>
                    <VerticalSpacer size="1rem" />

                    <p className={styles["user-info-section"]}>User ID  <span className={`${globalStyles["icon"]} ${styles['copy-icon']}`}></span></p>
                    <p
                        className={styles["user-id"]}
                        onClick={() => {
                            if (session.data?.user.id) {
                                navigator.clipboard.writeText(session.data.user.id);
                                notificationHelper("Copied user ID to clipboard.");
                            }
                        }}
                    >
                        {session.data?.user.id}
                    </p>
                </div>
                <VerticalSpacer size="1rem" />


            </div>

            <div className={styles.right}>
                {(() => {
                    switch (selectedTab) {
                        case TABS.LIKES: return <LikedPage
                            likedModules={likedModules}
                            setNotificationText={notificationHelper}
                            session={session}
                            triggerRefresh={() => triggerModuleRefresh(prev => prev + 1)}

                        />

                        case TABS.SAVED: return <BookmarksPage
                            bookmarks={bookmarkedModules}
                            setNotificationText={notificationHelper}
                            session={session}
                            triggerRefresh={() => triggerModuleRefresh(prev => prev + 1)}

                        />

                        case TABS.UPLOAD: return <UploadsPage
                            uploads={uploadedModules}
                            setNotificationText={notificationHelper}
                            session={session}
                            triggerRefresh={() => triggerModuleRefresh(prev => prev + 1)}
                        />
                        default: return undefined;
                    }
                })()}

            </div>
        </div>


        <div className={styles["notification-container"]}>
            <Alert textInfo={notificationText} />
        </div>
    </>
}


