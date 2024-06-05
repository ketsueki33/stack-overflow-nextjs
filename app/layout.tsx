import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
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
