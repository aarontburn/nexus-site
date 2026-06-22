"use client";

import styles from "./styles.module.css"
import sampleImage from "../assets/sample-image.png"
import { VerticalSpacer } from "../components/Components";
import { createClientDownloadAnalytic } from "../analytics/analytic-handler";
import { getLatestClientVersion } from "../utils/utils";
import { useEffect, useState } from "react";


interface Platform {
    displayName: string;
    platform: "win32" | "darwin" | 'linux';
    cssName: string;
    link: string | null;
}

const platforms: Platform[] = [
    {
        displayName: "Windows",
        platform: "win32",
        cssName: "Windows",
        link: "https://github.com/aarontburn/nexus-core/releases/latest/download/Nexus-Setup-win.exe"
    },
    {
        displayName: "Linux (AMD64)",
        platform: "linux",
        cssName: "Linux",
        link: "https://github.com/aarontburn/nexus-core/releases/latest/download/Nexus-Setup-linux-amd64.deb"
    }
    , {
        displayName: "Linux (ARM64)",
        platform: "linux",
        cssName: "Linux",
        link: "https://github.com/aarontburn/nexus-core/releases/latest/download/Nexus-Setup-linux-arm64.deb"
    },
    {
        displayName: "macOS",
        platform: "darwin",
        cssName: "macOS",
        link: null
    }
]




function OSDownload({ platform }: { platform: Platform }) {
    return < >
        <a
            href={platform.link ? platform.link : ''}
            className={`${styles["dl-download-button"]} ${platform.link ? '' : styles["disabled"]}`}
            aria-disabled={!platform.link}
            target="_blank"
            onClick={() => createClientDownloadAnalytic(platform.platform)}
        >
            <div className={`${styles[`${platform.cssName}-logo`]} ${styles['dl-logo']}`}></div>
            {platform.displayName}
        </a>
    </>
}


export default function NexusDownload() {
    const [latest, setLatestVersion] = useState<{ version: string, releaseDate: string } | null>(null);

    useEffect(() => {
        (async () => setLatestVersion(await getLatestClientVersion()))();
    }, []);


    return <div className={styles["dl-body"]}>
        <div className={styles["dl-left-container"]}>
            <h1>
                DOWNLOAD <span style={{ color: "var(--accent-color)" }}>NEXUS</span> FOR DESKTOP
            </h1>

            {latest
                ? <p>
                    Latest Version: <span style={{ color: "var(--accent-color)" }}>v{latest.version} </span>
                    ({new Date(latest.releaseDate).toLocaleDateString()})
                </p>
                : <p style={{ whiteSpace: "pre" }}> </p>}

            <br />
            <p>
                Already have Nexus installed? Check out the <a style={{ color: "var(--accent-color)" }} href="/marketplace">marketplace</a> to install modules.
            </p>

            { }

            <div className={styles["download-container"]}>
                {platforms.map(platform => <OSDownload key={platform.displayName} platform={platform} />)}
            </div>
            <VerticalSpacer size="1rem" />

        </div>

        <div className={styles["dl-right-container"]}>
            <img className={styles["sample-image"]} src={sampleImage.src} />
        </div>


    </div>
}