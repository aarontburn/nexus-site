import styles from "./components.module.css"

import { CSSProperties } from "react";

export const HorizontalSpacer = ({ size = "auto" }) => {
    return <div style={{ marginRight: size }}></div>;
}

export const VerticalSpacer = ({ size = "auto" }: { size?: string }) => {
    return <div style={{ marginTop: size, minHeight: "1px" }}></div>;
}

export const WhiteSpaceVerticalSpacer = ({ size = "auto" }: { size?: string }) => {
    return <div style={{ marginTop: size, minHeight: "1px" }}>&nbsp;</div>;
}


export function NexusText() {
    return <span style={{ color: "var(--accent-color)" }}>Nexus</span>
}



export function Spinner() {
    return <span className={styles["loader"]}></span>
}




export interface NexusLogoProps {
    width: string | number;
    height: string | number;
    style?: CSSProperties | undefined;
    className?: string | undefined
}

export function NexusLogo(props: NexusLogoProps) {
    return <div className={styles["component-nexus-logo"] + " " + (props.className ?? "")} style={{ ...props.style, ...{ width: props.width, height: props.height } }}></div>
}






