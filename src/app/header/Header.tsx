import "./header.css"
import { NexusLogo, HorizontalSpacer } from "../components/Components";
import { CSSProperties } from "react";


interface NavButtonProps {
    displayText: string;
    href: string;
    styles?: CSSProperties | undefined;
    className?: string | undefined;
}

function NavButton({ className, displayText, href, styles }: NavButtonProps) {
    return <a className={"nav-button " + (className ?? '')} style={styles} href={href}>{displayText}</a>
}

export function Header() {

    return <>
        <div id='header'>
            <HorizontalSpacer size="2rem" />
            <div className="header-logo-container">
                <a href="/">
                    <NexusLogo
                        width={"2.5rem"}
                        height={"2.5rem"}
                    />
                </a>


                <NavButton styles={{ marginLeft: 0, paddingLeft: "1rem", fontSize: "2rem" }} displayText="NEXUS" href="/" />

            </div>
            <HorizontalSpacer size="2rem" />



            <div className="header-button-container">
                <NavButton displayText="Download" href="/download" />
                <HorizontalSpacer size="2rem" />
                <NavButton displayText="Marketplace" href="/marketplace" />
                <HorizontalSpacer className="remove-mobile" size="2rem" />
                <NavButton className="remove-mobile" displayText="Privacy and Security" href="/develop/Security and Privacy.md" />
                <div className="header-spacer"></div>

                <NavButton displayText="Develop" href='/develop' />


                <div className="header-spacer remove-mobile" style={{ marginRight: "2rem" }}></div>

            </div>

        </div>

    </>
} 