"use client"

import { useEffect, useState } from "react";
import "./marketplace.css"
import { getAllRemoteModules, ModuleInfo } from "./NexusDatabase";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getAbbreviation } from "../utils/utils";
import { VerticalSpacer } from "../components/Components";
import MarketplaceHeader from "./MarketplaceHeader";


export default function NexusMarket() {

    const [searchQuery, setSearchQuery] = useState<string>()
    const [databaseModules, setDatabaseModules] = useState<ModuleInfo[]>([]);

    useEffect(() => {
        getAllRemoteModules().then(([cachedModules, resolvingModules]) => {
            setDatabaseModules(cachedModules ?? []);
            resolvingModules.then(result => setDatabaseModules(result ?? []));
        })
    }, [])

    return <div className="page">
        <MarketplaceHeader />
        <VerticalSpacer size={"5rem"} />

        <div className="body">
            <h2>All Modules</h2>

            <input type="text" />


            <div id="module-container">
                {databaseModules.map((moduleInfo, index) => <Module key={index} info={moduleInfo} />)}

            </div>


        </div>
    </div>

}




function Module({ info }: { info: ModuleInfo }) {
    const router: AppRouterInstance = useRouter();
    const onClick = () => router.push(`/marketplace/${info["module-id"]}`);

    return <div className="module">
        <div className="module-image-container clickable" onClick={onClick}>
            {info.image
                ? <img src={info.image} alt="icon" />
                : <p className="module-abbreviation">{getAbbreviation(info.name)}</p>}

        </div>
        <div className="module-info-container">
            <h3 onClick={onClick} className="module-info-name clickable">{info.name}</h3>
            <h4 onClick={() => {/* Set filter to be just the author*/ }}>{info.author}</h4>
            {info.description && <h4>{info.description}</h4>}
        </div>

    </div>
}