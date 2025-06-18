import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Download | Nexus',
    description: 'The latest release downloads for Nexus.',
    metadataBase: new URL("https://nexus-app.net/download"),
    openGraph: {
        type: "website",
        url: "https://nexus-app.net/download",
        title: "Download | Nexus",
        description: 'The latest release downloads for Nexus.',
        siteName: "Nexus",
        images: ['https://www.nexus-app.net/images/download.png']

    }
};

export default function Layout({ children }: { children: any }) {
    return <>
        {children}
    </>
}