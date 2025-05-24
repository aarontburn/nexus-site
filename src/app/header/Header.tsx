"use client"

import "./header.css"
import { useRouter } from "next/navigation";
import { NavButton, NexusLogo, HorizontalSpacer } from "../components/Components";

const FONT_SIZE: string = '1.25rem';

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

                <NavButton displayText="NEXUS" callback={() => { }} fontSize={"2rem"} />
            </div>


            <HorizontalSpacer size="5rem" />

            <NavButton displayText="Download" callback={() => router.push('/download')} fontSize={FONT_SIZE} />
            <NavButton displayText="Marketplace" callback={() => router.push('/marketplace')} fontSize={FONT_SIZE} />

            <HorizontalSpacer size="auto" />

            <NavButton displayText="Develop" callback={() => router.push('/develop/1 - Introduction.md')} fontSize={FONT_SIZE} />

        </div>

    </>
} 