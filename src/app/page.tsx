import { VerticalSpacer } from "./components/Components";
import "./styles.css";
import sampleImage from "./assets/sample-image-2.png"

import googleCalendarImage from "./assets/google-calendar.png";
import debugConsoleImage from "./assets/debug-console.png";
import spotifyMonkeyImage from "./assets/spotify-monkey.png";


function Card({ children }: any) {
    return <div className="feature-card">
        {children}
    </div>
}

function Link({ url, text }: { text: string, url: string }) {
    return <a href={url} target="_blank">{text}</a>
}

export default function Home() {
    return <div>
        <div className="container first">
            <div className="left">
                <div className="title">
                    <h1 className="title-text">NEXUS</h1>
                    <div className="nexus"></div>
                </div>

                <VerticalSpacer size="2rem" />

                <p style={{ fontSize: "1.5em" }}>A cross-platform application loader.</p>

                <a className="main-download" href="/download">
                    Download Now
                </a>

            </div>

            <div className="right">

                <img className="sample-image layer-1" src={googleCalendarImage.src} />
                <img className="sample-image layer-2" src={debugConsoleImage.src} />
                <img className="sample-image layer-3" src={spotifyMonkeyImage.src} />



            </div>
        </div>


        <div className="container">
            <VerticalSpacer size="2rem" />

            <h2 style={{ fontSize: "2em" }}>
                Install community-made <span style={{ color: "var(--accent-color)" }}>modules</span> that serve any purpose for any user.
            </h2>
            <VerticalSpacer size="2rem" />

            <div className="desc-box">
                <h1>Are you a</h1>
                <div className="feature-grid">
                    <Card>
                        <h3>🎨 Artist or Designer?</h3>
                        <p>Use the <Link url="" text="Color Picker" /> module for quick access to a color palette and eyedropper.</p>
                    </Card>

                    <Card>
                        <h3>🤖 AI Enthusiast?</h3>
                        <p>The <Link url="" text="ChatGPT" /> module gives you instant access to the AI chatbot inside Nexus.</p>
                    </Card>

                    <Card>
                        <h3>📬 Emailaholic?</h3>
                        <p>Install the <Link url="" text="Outlook" /> or <Link url="" text="Gmail" /> module for one-click inbox and calendar access.</p>
                    </Card>

                    <Card>
                        <h3>🎮 Gamer?</h3>
                        <p>Embed tools like <Link url="" text="Medal" />, <Link url="" text="Steam" />, or <Link url="" text="tactics.tools" /> for quick access.</p>
                    </Card>

                    <Card>
                        <h3>💬 Messenger?</h3>
                        <p>Try modules that embed <Link url="" text="Discord" />, <Link url="" text="Instagram" />, and <Link url="" text="Slack" /> to keep all your chat apps in one place.</p>
                    </Card>

                    <Card>
                        <h3>⌨️ Coder?</h3>
                        <p>Modules like an embedded <Link url="" text="GitHub Desktop" /> and a <Link url="" text="Debug Console" /> keep your workspace clutter free.</p>
                    </Card>
                </div>

                <VerticalSpacer size="1rem" />
                <h1>One application. Infinite uses.</h1>
            </div>
        </div>
    </div>

}
