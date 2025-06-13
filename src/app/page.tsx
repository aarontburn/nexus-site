"use client"

import { NexusLogo, NexusText, VerticalSpacer } from "./components/Components";
import "./styles.css";

import googleCalendarImage from "./assets/google-calendar.png";
import debugConsoleImage from "./assets/debug-console.png";
import spotifyMonkeyImage from "./assets/spotify-monkey.png";
import { Ref, useEffect, useRef } from "react";


function Accented({ children }: any) {
    return <span style={{ color: "var(--accent-color)" }}>{children}</span>
}

function Card({ children }: any) {
    return <div className="feature-card">
        {children}
    </div>
}

function Link({ url, text }: { text: string, url: string }) {
    return <a href={url} target="_blank">{text}</a>
}

export default function Home() {
    const aboutRef: Ref<HTMLHeadingElement> = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return <div style={{ height: "fit-content" }}>

        <div className="container first">
            <div className="left">
                
                <NexusLogo className={"nexus-logo-home"} width={"10rem"} height={"10rem"} />
                <h1 className="title-text">NEXUS</h1>
                <VerticalSpacer size="2rem" />
                <p className="nexus-desc" style={{ fontSize: "1.5em" }}>A cross-platform application loader.</p>

                <div className="home-buttons">
                    <a className="main-clickable" href="/download">
                        Download Now
                    </a>

                    <button
                        onClick={() => aboutRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        })}
                        className="main-clickable"
                        style={{ backgroundColor: "var(--accent-color)" }}>
                        Learn More
                    </button>
                </div>
            </div>

            <div className="right">
                <img className="home-image layer-1" src={googleCalendarImage.src} />
                <img className="home-image layer-2" src={debugConsoleImage.src} />
                <img className="home-image layer-3" src={spotifyMonkeyImage.src} />
            </div>
        </div>

        <div className="container second">

            <div className="background-image"></div>
            <h1 ref={aboutRef}>What is {<NexusText />}?</h1>
            <p>
                Nexus is a versatile, cross-platform application loader designed to be a toolbox.
                Browse the marketplace for applications, or <Accented>modules</Accented>, that you find useful,
                whether its a Gmail client, Discord embed, or a Screenshot Manager, Nexus has something for everyone.
            </p>
        </div>

        <VerticalSpacer size="5rem" />

        <div className="container third">

            <h2 style={{ fontSize: "1.5em" }}>
                Install community-made <span style={{ color: "var(--accent-color)" }}>modules</span> that serve any purpose for any user.
            </h2>
            <VerticalSpacer size="1rem" />

            <div className="desc-box">
                <h1>Are you a</h1>
                <div className="feature-grid">
                    <Card>
                        <h3>🎨 Artist or Designer?</h3>
                        <p>
                            Use the <Link url="marketplace/68342fbea2fbe5b2c6a76cf1" text="Color Picker" /> module
                            for quick access to a color palette and eyedropper.
                        </p>
                    </Card>

                    <Card>
                        <h3>🤖 AI Enthusiast?</h3>
                        <p>
                            The <Link url="marketplace/68351c5ceacf2ce8680778ee" text="ChatGPT" /> module gives you instant
                            access to the AI chatbot inside Nexus.
                        </p>
                    </Card>

                    <Card>
                        <h3>📬 Emailaholic?</h3>
                        <p>
                            Install the <Link url="marketplace/6837a73f382d9ca237cba6ec" text="Outlook" />
                            or <Link url="marketplace/6837a678382d9ca237cba6e5" text="Gmail" /> module for one-click inbox and calendar access.
                        </p>
                    </Card>

                    <Card>
                        <h3 >🎮 Gamer?</h3>
                        <p>
                            Embed tools like <Link url="marketplace/6837a709382d9ca237cba6e9" text="Medal" />
                            , <Link url="marketplace/6837aa9f382d9ca237cba6fd" text="Steam" />,
                            or <Link url="marketplace/6837aae8382d9ca237cba6ff" text="tactics.tools" /> for while you're gaming.
                        </p>
                    </Card>

                    <Card>
                        <h3>💬 Messenger?</h3>
                        <p>
                            Try modules that embed <Link url="marketplace/68379fdd4e3ad55b4a193abd" text="Discord" />
                            , <Link url="marketplace/6837a6cf382d9ca237cba6e7" text="Instagram" />,
                            and <Link url="marketplace/6837a9b7382d9ca237cba6f9" text="Slack" /> to keep all your chat apps in one place.
                        </p>
                    </Card>

                    <Card>
                        <h3>⌨️ Coder?</h3>
                        <p>
                            Modules like an embedded <Link url="marketplace/6837a535382d9ca237cba6e1" text="GitHub Desktop" /> and
                            a <Link url="marketplace/68342d1da2fbe5b2c6a76ce6" text="Debug Console" /> keep your coding workspace clutter free.
                        </p>
                    </Card>

                    <Card>
                        <h3>🎶 Audiophile?</h3>
                        <p>
                            Keep <Link url="marketplace/6837aa21382d9ca237cba6fb" text="Spotify" /> or
                            a <Link url="marketplace/6837ab14382d9ca237cba701" text="Volume Controller" /> handy
                            in your workspace by embedding it as a module.
                        </p>
                    </Card>
                </div>

                <VerticalSpacer size="1rem" />
                <h1>One application. Infinite uses.</h1>


            </div>
            <a className="main-clickable" href="/marketplace">
                Explore Modules
            </a>
        </div>


        <div className="container fourth">
            <h1>Or are you a developer?</h1>
            <p>Nexus modules have the tools to create powerful, interconnected applications that can be managed within a single window.</p>

            <div className="feature-grid">
                <Card>
                    <h3>📊 Familiar Web Technologies</h3>
                    <p>Develop modules using familiar web technologies like TypeScript, React, Node.js, and HTML.</p>
                </Card>

                <Card>
                    <h3>🛠️ Templates</h3>
                    <p>Quickly start building using numerous templates that fit your needs, whether you want to use React, plain HTML, or more.</p>
                </Card>

                <Card>
                    <h3>⚙️ Setting Management</h3>
                    <p>Handle user preferences effortlessly. Nexus takes care of your settings UI, storage, and lifecycle - so you can focus on developing.</p>
                </Card>

                <Card>
                    <h3>📩 Module Communication</h3>
                    <p>Modules can make requests to each other, enabling a powerful and connected modular ecosystem.</p>
                </Card>

                <Card>
                    <h3>📤 Export & Distribution</h3>
                    <p>Package your module into a lightweight ZIP file and share it on the Nexus marketplace or host it yourself.</p>
                </Card>

                <Card>
                    <h3>🆕 Auto Updates</h3>
                    <p>Supports automatic updates with minimal setup - keep your modules fresh without manual intervention.</p>
                </Card>

                <Card>
                    <h3>📜 Developer-Friendly Docs</h3>
                    <p>Well-written and growing documentation makes it easy to get started and build advanced modules with confidence.</p>
                </Card>

                <Card>
                    <h3>♾️ Limitless Possibilities</h3>
                    <p>Built on Electron, Nexus lets you use the full Electron API and any NPM package - no constraints, just creativity.</p>
                </Card>

            </div>


            <a className="main-clickable" href="/develop">
                Start Developing
            </a>
        </div>

    </div>

}
