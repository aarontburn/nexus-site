import { Metadata } from "next";
import MarketplaceHeader from "./MarketplaceHeader";


export const metadata: Metadata = {
    title: 'Marketplace | Nexus',
    description: 'The official module marketplace for Nexus.',
    metadataBase: new URL("https://nexus-app.net/marketplace"),
    openGraph: {
        type: "website",
        url: "https://nexus-app.net/marketplace",
        title: "Marketplace | Nexus",
        description: 'The official module marketplace for Nexus.',
        siteName: "Nexus",
        images: ['https://www.nexus-app.net/images/marketplace.png']

    }
};

export default function Layout({ children }: { children: any }) {
    return <>
        <MarketplaceHeader />
        {children}
    </>
}