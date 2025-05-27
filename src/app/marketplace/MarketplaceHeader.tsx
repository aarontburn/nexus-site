import styles from "./marketplace.module.css"

import { signOut, useSession } from "next-auth/react";
import { VerticalSpacer, HorizontalSpacer } from "../components/Components";
import { useRouter } from "next/navigation";

export default function MarketplaceHeader() {
    const session = useSession();
    const router = useRouter();

    return <div className={styles["mp-header"]}>
        <VerticalSpacer size={"calc(5rem - 1px)"} />

        <div className={styles["mp-header-content"]}>

            <h2 className={styles["clickable"]} onClick={() => router.push("/marketplace")}>Nexus Marketplace</h2>
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
