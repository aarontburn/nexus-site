"use client"

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "./header/Header";
import { VerticalSpacer } from "./components/Components";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <Header />
                    <VerticalSpacer size={"var(--header-size)"} />
                    
                    {children}
                </SessionProvider>

            </body>
        </html>
    );
}
