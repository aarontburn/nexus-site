import { ReactNode } from "react";

export const Spacer = ({ size = "auto" }) => {
    return <div style={{ marginRight: size }}></div>;
}


export function NavButton({ displayText, callback, fontSize, image, width }: { displayText: string, callback: () => void, fontSize: string, image?: string, width?: string }) {
    if (image === undefined) {
        return <h2 className="nav-button" style={{ fontSize: fontSize, width: width }} onClick={callback}>{displayText}</h2>
    }
    return <div onClick={callback} className="logo-nav" style={{ width: width }}>
        <img style={{ width: fontSize, height: fontSize }} src={image} alt="Logo" />
        <h2 style={{ fontSize: fontSize }}>{displayText}</h2>
    </div>
}


export function List({ text, children }: { text: string | ReactNode, children?: ReactNode }) {
    return <>
        <li>{text}</li>
        <div style={{ marginLeft: '1.5em', marginBottom: '0.5em' }}>
            {children}
        </div>
    </>
}

export function Bold({ children }: { children?: ReactNode }) {
    return <div style={{ fontWeight: 550 }}>
        {children}
    </div>
}



const LINKEDIN_URL: string = 'https://www.linkedin.com/in/aaronburnham/';
const GITHUB_URL: string = 'https://github.com/aarontburn';


export function openLink(url: string | 'LinkedIn' | 'GitHub' | undefined) {
    if (url === undefined) {
        return;
    }

    let newWindow;
    if (url === "LinkedIn") {
        newWindow = window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer');
    } else if (url === 'GitHub') {
        newWindow = window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
    } else {
        newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    }

    if (newWindow) {
        newWindow.opener = null;
    }
}


