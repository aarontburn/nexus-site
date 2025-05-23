"use client"

import "./header.css"
import { useRouter } from "next/navigation";
import { NavButton, Spacer } from "../components/Components";

const FONT_SIZE: string = '1.5rem';

export function Header() {
    const router = useRouter();
    return <>
        <div id='header'>
            <NavButton displayText="Nexus" callback={() => router.push('/')} fontSize={"1.75rem"} />

            <Spacer size="5rem"/>

            <NavButton displayText="Download" callback={() => router.push('/download')} fontSize={FONT_SIZE} />
            <NavButton displayText="Marketplace" callback={() => router.push('/marketplace')} fontSize={FONT_SIZE} />
            <Spacer />

        </div>

    </>
} 