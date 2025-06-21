import { Metadata } from "next";
import { DevelopContextProvider } from "./context";
import LeftSidebar from "./LeftSidebar";
import styles from "./styles.module.css";

export const metadata: Metadata = {
    title: 'Documentation | Nexus',
    description: 'Developer documentation for Nexus.',
    metadataBase: new URL("https://nexus-app.net/develop"),
    openGraph: {
        type: "website",
        url: "https://nexus-app.net/develop",
        title: "Documentation | Nexus",
        description: 'Developer documentation for Nexus.',
        siteName: "Nexus",
        images: ['https://www.nexus-app.net/images/develop.png']

    }
};

export default function Layout({ children }: { children: any }) {
    return <div className={styles["develop-page"]}>
        <DevelopContextProvider>
            <LeftSidebar />
            {children}
        </DevelopContextProvider>
    </div>
}