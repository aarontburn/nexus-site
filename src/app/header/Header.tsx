"use client"

import "./header.css"
import { useRouter } from "next/navigation";
import { NavButton, Spacer } from "../components/Components";

const FONT_SIZE: string = '1.2em';

export function Header() {
    const router = useRouter();
    return <>
        <div id='header'>
            <NavButton displayText="Nexus" callback={() => router.push('/')} fontSize={"1.5em"} />

            <Spacer size="5em"/>

            <NavButton displayText="About" callback={() => router.push('/about')} fontSize={FONT_SIZE} />
            <NavButton displayText="Download" callback={() => router.push('/download')} fontSize={FONT_SIZE} />
            <NavButton displayText="Marketplace" callback={() => router.push('/marketplace')} fontSize={FONT_SIZE} />
            <Spacer />

        </div>

    </>
} 