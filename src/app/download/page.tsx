import "./styles.css"
import sampleImage from "../assets/sample-image.png"
import { VerticalSpacer } from "../components/Components"

function OSDownload({ platform }: { platform: string }) {
    return <>
        <button className="dl-download-button" >
            <div className={`${platform}-logo dl-logo`}></div>
            {platform}
        </button>

    </>
}


export default function NexusDownload() {
    return <div className="page">
        <VerticalSpacer size={"5rem"} />
        <div className="body">
            <div className="dl-left-container">
                <h1>
                    DOWNLOAD <span style={{ color: "var(--accent-color)" }}>NEXUS</span> FOR DESKTOP
                </h1>
                <p>
                    Already have Nexus installed? Check out the <a style={{ color: "var(--accent-color)" }} href="/marketplace">marketplace</a> to install modules.
                </p>
                <div className="download-container">
                    <OSDownload platform="Windows" />
                    <OSDownload platform="macOS" />
                    <OSDownload platform="Linux" />
                </div>
            </div>

            <div className="dl-right-container">
                <img className="sample-image" src={sampleImage.src} />


            </div>



        </div>
    </div>
}