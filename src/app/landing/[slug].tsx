import { useRouter } from "next/router";
import React from "react";
import Head from 'next/head';
import LandingNavigation from "@components/LandingNavigation";
import { motion } from "framer-motion";
import { fadeInUp, slideInFromTop, slideInFromLeft, slideInFromBottom, slideInFromRight } from "../../motionConfig";
import CallToActionSection from "@components/CallToActionSection";
import { NextSeo } from 'next-seo';
import CanonicalURL from '@components/CanonicalURL';
import { Quantico } from "next/font/google";

const quantico = Quantico({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

const services = [
    {
        slug: "noetic-web-apps",
        title: "Custom Web Apps",
        desc: "Beyond Templates. Tailored, Scalable, and Built for Impact.",
        howItWorks: "We don’t do one-size-fits-all. We build web applications designed around your business, helping you automate tasks, optimize workflows, and scale effortlessly. Whether you're launching a startup, managing operations, or creating a customer portal, we craft solutions that work exactly how you need them to.",
        whatWeOffer: [
            "User-First Design: Interfaces built for seamless, intuitive navigation.",
            "Scalable Architecture: Future-proof platforms that grow with your business.",
            "Custom Features: No unnecessary fluff—just the tools you need to succeed.",
        ],
    },
    {
        slug: "noetic-custom-tools",
        title: "Custom Tools",
        desc: "Smart Digital Tools That Make Your Workflow Unstoppable.",
        howItWorks: "We develop custom tools that tackle real-world problems. Whether you need a financial calculator, an internal dashboard, or a dynamic directory, we build solutions that improve efficiency and help teams make smarter decisions.",
        whatWeOffer: [
            "Dynamic Calculators: Custom computation tools tailored to your needs.",
            "Data Dashboards: Interactive visualizations that bring numbers to life.",
            "Automated Support Systems: Build ticketing tools, chatbots, and knowledge bases.",
        ],
    },
    {
        slug: "noetic-api-integrations",
        title: "API Integrations",
        desc: "Unifying Systems. Connecting Data. Powering Efficiency.",
        howItWorks: "Disjointed tools and manual data entry slow businesses down. We bridge the gap by integrating your systems, ensuring real-time syncing, seamless communication, and automated workflows across platforms.",
        whatWeOffer: [
            "Third-Party Integrations: Connect with CRMs, payment gateways, and more.",
            "Secure & Reliable: Data is encrypted, optimized, and always protected.",
            "Real-Time Sync: Keep your platforms updated without lifting a finger.",
        ],
    },
    {
        slug: "noetic-marketing",
        title: "Noetic Marketing - SEO/SMM/PPC Advertising",
        desc: "Visibility Without Noise. Strategies That Deliver.",
        howItWorks: "Marketing isn’t about shouting into the void—it’s about targeted precision. We create data-backed SEO, PPC, and social media strategies that ensure your brand gets in front of the right audience at the right time.",
        whatWeOffer: [
            "High-Impact PPC & SMM: Maximize ROI with strategic ad placements.",
            "SEO Optimization: Get found with search-friendly content and site structure.",
            "Backlinking Strategies: Build authority and improve rankings the right way.",
        ],
    },
    {
        slug: "automation-and-web-scraping",
        title: "Noetic Automation & Web Scraping",
        desc: "Data-Driven Decisions Without the Busywork.",
        howItWorks: "Why waste time on manual data collection when automation can do it for you? We build powerful web scrapers and automated workflows that extract, organize, and analyze the data you need to stay ahead of the competition.",
        whatWeOffer: [
            "Web Scraping: Extract structured data in real-time.",
            "Workflow Automation: Cut repetitive tasks and free up valuable time.",
            "Intelligent Triggers: Get notified when key data points change.",
        ],
    },
    {
        slug: "noetic-chrome-extensions",
        title: "Chrome Extensions",
        desc: "Custom Browser Tools That Work the Way You Do.",
        howItWorks: "We design Chrome extensions that improve productivity, automate workflows, and bring essential tools right to your browser. Whether it's data storage, advanced bookmarking, or workflow automation, we build solutions that integrate seamlessly into your daily operations.",
        whatWeOffer: [
            "Data Management: Save and organize critical information in one click.",
            "Advanced Bookmarking: Never lose an important page again.",
            "Task Automation: Reduce manual work with smart browsing shortcuts.",
        ],
    },
];


const LandingPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return <p className="text-center mt-20">Service not found</p>;
    }

    const customSEO = {
        title: `${service.title} - Noetic Software and Web Key Solutions`,
        description: service.desc,
        openGraph: {
            title: `${service.title} - Noetic Software and Web Key Solutions`,
            description: service.desc,
            url: `https://noetics.io/landing/${slug}`,
        },
    };

    return (
        <>
            <Head>
                <title>{service.title} - Noetic Software and Web Key Solutions</title>
                <meta name="description" content={service.desc} />
            </Head>
            <CanonicalURL url={`https://noetics.io/landing/${slug}`} />
            <LandingNavigation />
            <motion.section
                className={"bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white" + quantico.className}
                {...fadeInUp}
            >
                <div className={"min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 mt-12 " + quantico.className}>
                    {/* Hero Section */}
                    <motion.header
                        className="bg-zinc-950 text-white py-20 text-center"
                        {...slideInFromTop}
                    >
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-5xl font-bold">{service.title}</h1>
                            <p className="mt-4 text-xl text-secondary">{service.desc}</p>
                        </div>
                    </motion.header>

                    {/* What We Offer Section */}
                    <motion.section
                        className="w-full min-w-full bg-zinc-100 dark:bg-zinc-800"
                        {...slideInFromLeft}
                    >
                        <div className="max-w-5xl mx-auto px-4 py-12">
                            <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">What We Give</h2>
                            <div className="border-b-4 border-secondary mb-6 mx-96"></div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {service.whatWeOffer.map((offer, index) => (
                                    <li
                                        key={index}
                                        className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-600"
                                    >
                                        <p className="text-zinc-700 dark:text-zinc-300">{offer}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>

                    {/* How It Works Section */}
                    <motion.section
                        className="max-w-4xl mx-auto px-4 py-12 dark:bg-zinc-900"
                        {...slideInFromRight}
                    >
                        <h2 className="text-3xl font-bold mb-2 dark:text-white">How this works</h2>
                        <div className="border-b-4 border-secondary mb-6 w-1/6"></div>
                        <p className="text-lg text-zinc-700 dark:text-zinc-300">{service.howItWorks}</p>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.div {...slideInFromBottom}>
                        <CallToActionSection
                            title={`Looking for ${service.title}?`}
                            subtitle="Contact us today to get started!"
                        />
                    </motion.div>
                </div>

            </motion.section>
            <footer className="bg-zinc-800 text-white h-min flex py-6 items-center justify-center">
                <p className={"text-sm " + quantico.className}>
                    &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                </p>
            </footer>
        </>
    );
};

export default LandingPage;