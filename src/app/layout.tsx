import "./globals.css";
import { Header } from "./header/Header";
import { VerticalSpacer } from "./components/Components";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SessionWrapper from "./SessionWrapper";

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
