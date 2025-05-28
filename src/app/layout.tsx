"use client"

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "./header/Header";
import { VerticalSpacer } from "./components/Components";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Session } from "next-auth";

export default function RootLayout({ children, session }: Readonly<{ children: React.ReactNode, session: Session }>) {
    return (
        <html lang="en">
            <body>
                <SessionProvider session={session}>

                    <Header />
                    <VerticalSpacer size={"calc(var(--header-size) - 1px)"} />

                    {children}

                </SessionProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
