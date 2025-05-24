"use client"

import { useSession } from "next-auth/react";
import { VerticalSpacer } from "../../components/Components";
import MarketplaceHeader from "../MarketplaceHeader";
import styles from "./account.module.css"


export default function AccountPage() {
    const session = useSession({
        required: true,
    });

    return <>
        <MarketplaceHeader />
        <VerticalSpacer size={"4rem"} />

        <div className={styles["account-body"]}>

            <p>{session.data?.user?.email}</p>
            <p>{session.data?.user?.name}</p>
            <p>{session.data?.user?.id}</p>
        </div>


    </>
}