
import Transition from "./components/Transition";
import "./globals.css";
import { Header } from "./header/Header";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body>
                <Header />
                    {children}
            </body>
        </html>
    );
}
