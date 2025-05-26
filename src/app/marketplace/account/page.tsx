"use client"

import { SessionContextValue, useSession } from "next-auth/react";
import { HorizontalSpacer, Spinner, VerticalSpacer } from "../../components/Components";
import MarketplaceHeader from "../MarketplaceHeader";
import styles from "./account.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getModulesFromUser, ModuleInfo } from "../NexusDatabase";
import React from "react";
import { getAbbreviation } from "../../utils/utils";
import EditModuleScreen from "./EditModule";


export default function AccountPage() {


    const router = useRouter();
    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/marketplace/login");
        },
    });


    const [editTarget, setEditTarget] = useState<ModuleInfo | null | undefined>(undefined);
    const editModule = (module: ModuleInfo | null | undefined) => {
        setEditTarget(module);
    }


    return <>
        <MarketplaceHeader />
        <VerticalSpacer size={"4rem"} />

        <div className={styles["account-body"]}>

            <div className={styles.left}>
                <p>{session.data?.user?.email}</p>
                <p>{session.data?.user?.name}</p>
                <p>{session.data?.user?.id}</p>
            </div>

            <div className={styles.right}>
                {editTarget !== undefined
                    ? <EditModuleScreen editModule={editModule} editTarget={editTarget} session={session} />
                    : <ModuleListScreen editModule={editModule} session={session} />
                }

            </div>
        </div>
    </>
}



function ModuleListScreen({ session, editModule }: { session: SessionContextValue, editModule: (module: ModuleInfo | null | undefined) => void }) {
    const [uploadedModules, setUploadedModules] = useState<ModuleInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (session.status === "authenticated") {
            getModulesFromUser(session.data.user.id).then((result) => {
                setUploadedModules(result ?? [])
                setIsLoading(false);
            });
        }
    }, [session])

    return <>
        <div className={styles.header}>
            <h1>Your Modules</h1>
            <HorizontalSpacer />
            <button onClick={() => editModule(null)}>
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
                                    <Module editModule={editModule} moduleInfo={module} />
                                    <VerticalSpacer size={"1rem"} />
                                </React.Fragment>
                            )
                        }
                    </div>
                </>

        }
    </>
}


function Module({ moduleInfo, editModule }: { moduleInfo: ModuleInfo, editModule: (module: ModuleInfo | null | undefined) => void }) {
    return <div className={styles["module"]}>
        <div className={styles["title"]}>
            <div className={styles["image"]}>
                {moduleInfo.image
                    ? <img src={moduleInfo.image} alt="icon" />
                    : <p className="module-abbreviation">{getAbbreviation(moduleInfo.name)}</p>}

            </div>
            <div className={styles["module-info"]}>
                <h1>{moduleInfo.name}</h1>
                <h2>{moduleInfo["module-id"]}</h2>
                <p>v{moduleInfo.version}</p>
            </div>
        </div>

        <VerticalSpacer size={"1rem"} />

        <div className={styles["button-container"]}>
            <a href={`/marketplace/${moduleInfo["module-id"]}`}>
                View
            </a>
            <HorizontalSpacer size="1rem" />
            <button onClick={() => editModule(moduleInfo)}>
                Edit
            </button>

        </div>
    </div>
}