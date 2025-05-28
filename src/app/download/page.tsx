"use client";

import styles from "./styles.module.css"
import sampleImage from "../assets/sample-image.png"
import { VerticalSpacer } from "../components/Components";



const platformMap = {
    "Windows": "https://github.com/aarontburn/nexus-core/releases/latest/download/Nexus-Setup.exe",
    "macOS": null,
    "Linux": null,
}


function OSDownload({ platform }: { platform: keyof typeof platformMap }) {
    return <>
        <a
            href={platformMap[platform] ? platformMap[platform] : ''}
            className={`${styles["dl-download-button"]} ${platformMap[platform] ? '' : styles["disabled"]}`}
            aria-disabled={!platformMap[platform]}
        >
            <div className={`${styles[`${platform}-logo`]} ${styles['dl-logo']}`}></div>
            {platform}
        </a>

    </>
}


export default function NexusDownload() {
    return <div className={styles["dl-body"]}>
        <div className={styles["dl-left-container"]}>
            <h1>
                DOWNLOAD <span style={{ color: "var(--accent-color)" }}>NEXUS</span> FOR DESKTOP
            </h1>
            <p>
                Already have Nexus installed? Check out the <a style={{ color: "var(--accent-color)" }} href="/marketplace">marketplace</a> to install modules.
            </p>
            <div className={styles["download-container"]}>
                {Object.keys(platformMap).map(osName => <OSDownload key={osName} platform={osName as keyof typeof platformMap} />)}
            </div>
            <VerticalSpacer size="1rem" />
            <sub>At this time, Nexus is Windows only. A Linux build is being actively worked on.</sub>

        </div>

        <div className={styles["dl-right-container"]}>
            <img className={styles["sample-image"]} src={sampleImage.src} />
        </div>


    </div>
}