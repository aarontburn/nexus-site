"use client"

import { useEffect, useState } from "react";
import "./marketplace.css"
import Image from 'next/image'
import smIcon from "./spotify-monkey.png";
import { fetchWithOAuth2 } from "./NexusDatabase";


export default function NexusMarket() {
    const [searchQuery, setSearchQuery] = useState<string>()

    useEffect(() => {
        fetchWithOAuth2()

    }, [])

    return <div className="page">
        <div className="body mbody">
            <div className="left"></div>
            <div className="right"></div>
            <div className="main">
                <h2>All Modules</h2>
                
                <input type="text" />


                <div id="module-container">
                    <Module
                        name="Debug Console"
                        shortDesc="Debug and view console outputs within Nexus."
                        author="aarontburn" />

                    <Module
                        name="Spotify Monkey"
                        author="aarontburn" />


                </div>

            </div>

        </div>
    </div>
}


interface ModuleProps {
    name: string;
    author: string;
    shortDesc?: string;
    image?: string;

}

function Module({ name, shortDesc, image, author }: ModuleProps) {
    return <div className="module">
        <div className="module-image-container">
            <Image src={smIcon} alt="icon" width={64} height={64}/>
        </div>
        <div className="module-info-container">
            <h3 className="module-info-name">{name}</h3>
            <h4>{author}</h4>
            {shortDesc && <h4>{shortDesc}</h4>}
        </div>

    </div>
}