import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Documentation | Nexus',
    description: 'Developer documentation for Nexus.',
    metadataBase: new URL("https://nexus-app.net/develop"),
    openGraph: {
        type: "website",
        url: "https://nexus-app.net/develop",
        title: "Download | Nexus",
        description: 'Developer documentation for Nexus.',
        siteName: "Nexus",
        images: ['https://www.nexus-app.net/images/develop.png']

    }
};

export default function Layout({ children }: { children: any }) {
    return <>
        {children}
    </>
}