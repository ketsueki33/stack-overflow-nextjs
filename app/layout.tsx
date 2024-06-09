import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";

import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
    title: "CodeOverflow",
    description:
        "CodeOverflow is a programmer's Q&A platform inspired by Stack Overflow. Ask and answer questions, vote on the best solutions, and connect with a vibrant community of developers.",
};

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-spaceGrotesk",
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    formButtonPrimary: "primary-gradient",
                    footerActionLink: "primary-text-gradient hover:text-primary-500",
                },
            }}
        >
            <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
                <body className="font-sans">
                    This text will use default inter font taken from body className
                    <h1 className="h1-bold font-grotesk">
                        {" "}
                        This text will use space grotesk front taken from this h1 className
                    </h1>
                    {/* <header>
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton/>
        </SignedIn>
    </header> */}
                    <main>{children}</main>
                </body>
            </html>
        </ClerkProvider>
    );
}
