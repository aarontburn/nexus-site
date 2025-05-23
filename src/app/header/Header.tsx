"use client"

import "./header.css"
import { useRouter } from "next/navigation";
import { NavButton, NexusLogo, Spacer } from "../components/Components";

const FONT_SIZE: string = '1.25rem';

export function Header() {
    const router = useRouter();
    return <>
        <div id='header'>
            <Spacer size="2rem" />
            <div className="header-logo-container" onClick={() => router.push('/')}>
                <NexusLogo
                    width={"3.5rem"}
                    height={"3.5rem"}
                />

                <NavButton displayText="Nexus" callback={() => { }} fontSize={"1.5rem"} />
            </div>


            <Spacer size="5rem" />

            <NavButton displayText="Download" callback={() => router.push('/download')} fontSize={FONT_SIZE} />
            <NavButton displayText="Marketplace" callback={() => router.push('/marketplace')} fontSize={FONT_SIZE} />

            <Spacer size="auto" />

            <NavButton displayText="Develop" callback={() => router.push('/develop')} fontSize={FONT_SIZE} />

        </div>

    </>
} 