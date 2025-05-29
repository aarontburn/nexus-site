import "./globals.css";
import { Header } from "./header/Header";
import { VerticalSpacer } from "./components/Components";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SessionWrapper from "./SessionWrapper";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nexus',
    description: 'A cross-platform application loader.',
    metadataBase: new URL("https://nexus-app.net"),
    openGraph: {
        type: "website",
        url: "https://nexus-app.net",
        title: "Nexus",
        description: 'A cross-platform application loader.',
        siteName: "Nexus",
        images: ['https://www.nexus-app.net/images/image.png']

    }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <SessionWrapper>

                    <Header />
                    <VerticalSpacer size={"calc(var(--header-size) - 1px)"} />

                    {children}

                </SessionWrapper>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
