import styles from "./marketplace.module.css"

import { signOut, useSession } from "next-auth/react";
import { HorizontalSpacer } from "../components/Components";

export default function MarketplaceHeader() {
    const session = useSession();

    return <div className={styles["mp-header"]}>
        <div className={styles["mp-header-content"]}>

            <h2 className={styles["clickable"]}>
                <a href="/marketplace">Nexus Marketplace</a>
            </h2>
            <HorizontalSpacer />
            {
                session.status === "authenticated"
                    ? <a href="/marketplace/account">Modules</a>
                    : <a href="/marketplace/login">Login/Register</a>
            }

            {
                session.status === "authenticated" && <>
                    <HorizontalSpacer size="1rem" />
                    <p className={styles["clickable"]} onClick={() => signOut()}>Sign Out</p>
                </>
            }


        </div>

    </div>
}
