import React, { ReactNode } from 'react';
import Navigation from '@components/Navigation';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { Quantico } from "next/font/google";
import { DarkModeProvider } from "@context/DarkModeContext";
import '@styles/tailwind.css'; // Import global styles

const quantico = Quantico({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <DarkModeProvider>
                    <>
                        <Head>
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <meta name="description" content="Noetic Software and Web Key Solutions" />
                            <link rel="canonical" href="https://noetics.io" />
                            <title>Noetics Web Creations</title>
                        </Head>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=G-S9Q4511QJC`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga4-init" strategy="afterInteractive">
                            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-S9Q4511QJC');
                        `}
                        </Script>
                        <div className={" bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-white " + quantico.className}>
                            <header className={"bg-white dark:bg-zinc-500 z-50 pt-2 fixed top-0 left-0 w-full dark:border-0 dark:border-zinc-700 " + quantico.className}>
                                <Navigation fontClass={quantico.className} />
                            </header>
                            <main className={"flex flex-col mt-16 min-h-screen " + quantico.className}>
                                {children}
                            </main>
                            <footer className="bg-zinc-800 dark:bg-zinc-900 text-white py-6 flex items-center justify-center">
                                <div className={"container mx-auto text-center"}>
                                    <p className={"text-sm" + quantico.className}>
                                        &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                                    </p>
                                    <Link className='underline text-secondary text-base track-wider' href="/privacy-policy">
                                        Privacy Policy
                                    </Link>
                                </div>
                            </footer>
                        </div>
                    </>
                </DarkModeProvider>
            </body>
        </html>
    );
};

export default RootLayout;