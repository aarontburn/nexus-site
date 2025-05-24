"use client"

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "./header/Header";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <Header />
                    {children}
                </SessionProvider>

            </body>
        </html>
    );
}
