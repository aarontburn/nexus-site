"use client"

import { useSession } from "next-auth/react";
import { VerticalSpacer } from "../../components/Components";
import MarketplaceHeader from "../MarketplaceHeader";
import styles from "./account.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModuleInfo } from "../NexusDatabase";


export default function AccountPage() {
    const [uploadedModules, setUploadedModules] = useState<ModuleInfo[]>([]);


    const router = useRouter();
    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/marketplace/login")
        },
    });


    useEffect(() => {

    }, [])

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
                <h1>Your Modules</h1>
                
            </div>


        </div>


    </>
}