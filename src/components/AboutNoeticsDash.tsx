import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ga4noetics from '/public/ga4-nextnoetics-dark.png';
import cmsnoetics from '/public/noetic-cms.gif';
import smmnoetics from '/public/noetic-smm.png';
import { motion } from "framer-motion";
import { fadeInRight } from "../motionConfig";

const AboutNoeticsDash = () => {
    return (
        <motion.section id="services" className="bg-zinc-900 dark:bg-zinc-950 py-20" {...fadeInRight}>
            <div className="p-8">
                <h2 className="text-4xl font-bold mb-6 text-primary text-center">The Noetic Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-primary  text-center">Google Analytics 4 Dashboard</h3>
                        <p className="mb-2 text-center text-base">View your GA4 data - search pages, easier to read, & customizable.</p>
                        <Image
                            src={ga4noetics}
                            alt="Noetics Google Analytics 4 Dashboard"
                            width={450}
                            height={200}
                            className="mb-7 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2 ">Other SEO Tools you can integrate with:</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>SemRush</li>
                            <li>Ahrefs</li>
                            <li>Moz & Hotjar (Coming soon)</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-200 dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-primary">Noetics Content Management System</h3>
                        <p className="mb-2 text-center text-base">Manage your content, blog posts, & pages.</p>
                        <Image
                            src={cmsnoetics}
                            alt="Noetics Content Management System"
                            width={450}
                            height={200}
                            className="mb-7 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2 text-center">Don't like ours :( - No worries! Here are some other CMS you can integrate with:</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>WordPress</li>
                            <li>Contentful</li>
                            <li>Strapi & Ghost (Coming soon)</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-300 dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-primary  text-center">Social Media Marketing Calendar</h3>
                        <p className="text-center text-base">Plan your & schedule your social media posts & analyze performance.</p>
                        <Image
                            src={smmnoetics}
                            alt="Noetics social media calendar"
                            width={450}
                            height={200}
                            className="mb-10 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2">Other Social Media Tools you can integrate with:</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>Buffer</li>
                            <li>Sprout Social & Later (Coming soon)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutNoeticsDash;