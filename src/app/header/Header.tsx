"use client"

import "./header.css"
import { useRouter } from "next/navigation";
import { NexusLogo, HorizontalSpacer } from "../components/Components";

const FONT_SIZE: string = '1.25rem';


function NavButton({ displayText, callback, fontSize, width }: { displayText: string, callback: () => void, fontSize: string, width?: string }) {
    return <h2 className="nav-button" style={{ fontSize: fontSize, width: width }} onClick={callback}>{displayText}</h2>
}

export function Header() {
    const router = useRouter();

    return <>
        <div id='header'>
            <HorizontalSpacer size="2rem" />
            <div className="header-logo-container" onClick={() => router.push('/')}>
                <NexusLogo
                    width={"2.5rem"}
                    height={"2.5rem"}
                />

                <HorizontalSpacer size="1rem" />
                <NavButton displayText="NEXUS" callback={() => { }} fontSize={"2rem"} />
            </div>


            <div className="header-spacer"></div>


            <div className="header-button-container">
                <NavButton displayText="Download" callback={() => router.push('/download')} fontSize={FONT_SIZE} />
                <HorizontalSpacer size="1rem" />

                <NavButton displayText="Marketplace" callback={() => router.push('/marketplace')} fontSize={FONT_SIZE} />
                <HorizontalSpacer size="1rem" />

                <div className="header-spacer"></div>
                <NavButton displayText="Develop" callback={() => router.push('/develop/1 - Introduction.md')} fontSize={FONT_SIZE} />
            </div>

        </div>

    </>
} 