import { ReactNode } from "react";

export const Spacer = ({ size = "auto" }) => {
    return <div style={{ marginRight: size }}></div>;
}

export const VerticalSpacer = ({ size = "auto" }: { size?: string | number }) => {
    return <div style={{ marginTop: size }}></div>;
}


export function NexusText() {
    return <span style={{ color: "var(--accent-color)" }}>Nexus</span>
}

export function NavButton({ displayText, callback, fontSize, image, width }: { displayText: string, callback: () => void, fontSize: string, image?: string, width?: string }) {
    if (image === undefined) {
        return <h2 className="nav-button" style={{ fontSize: fontSize, width: width }} onClick={callback}>{displayText}</h2>
    }
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


