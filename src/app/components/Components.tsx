import "./components.css"

import { CSSProperties, ReactNode } from "react";

export const Spacer = ({ size = "auto" }) => {
    return <div style={{ marginRight: size }}></div>;
}

export const VerticalSpacer = ({ size = "auto" }: { size?: string | number }) => {
    return <div style={{ marginTop: size }}></div>;
}


export function NexusText() {
    return <span style={{ color: "var(--accent-color)" }}>Nexus</span>
}

export function NavButton({ displayText, callback, fontSize, width }: { displayText: string, callback: () => void, fontSize: string, width?: string }) {
    return <h2 className="nav-button" style={{ fontSize: fontSize, width: width }} onClick={callback}>{displayText}</h2>
}


export interface NexusLogoProps {
    width: string | number;
    height: string | number;
    style?: CSSProperties | undefined;
    className?: string | undefined
}

export function NexusLogo(props: NexusLogoProps) {
    return <div className={"component-nexus-logo " + (props.className ?? "")} style={{...props.style, ...{ width: props.width, height: props.height }}}></div>
}


export function Bold({ children }: { children?: ReactNode }) {
    return <div style={{ fontWeight: 550 }}>
        {children}
    </div>
}





export function openLink(url: string | 'LinkedIn' | 'GitHub' | undefined) {
    if (url === undefined) {
        return;
    }

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (newWindow) {
        newWindow.opener = null;
    }
}


