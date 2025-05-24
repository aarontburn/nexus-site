import "./marketplace.css"

import { signOut, useSession } from "next-auth/react";
import { VerticalSpacer, HorizontalSpacer } from "../components/Components";
import { useRouter } from "next/navigation";

export default function MarketplaceHeader() {
    const session = useSession();
    const router = useRouter();

    return <div className="mp-header">
        <VerticalSpacer size={"4.9rem"} />

        <div className="mp-header-content">

            <h2 className="clickable" onClick={() => router.push("/marketplace")}>Nexus Marketplace</h2>
            <HorizontalSpacer />
            {session.status === "authenticated"
                ? <a href="/marketplace/account">Account</a>
                : <a href="/marketplace/login">Login/Register</a>
            }

            {session.status === "authenticated" && <>
                <HorizontalSpacer size="1rem" />
                <p className="clickable" onClick={() => signOut()}>Sign Out</p>
            </>}


        </div>

    </div>
}
