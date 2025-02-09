'use client';
import React from "react";
import { motion } from "framer-motion";
import { fadeInRight } from "../motionConfig";

const ServicesSection = () => {
  return (
    <motion.section id="services" className="bg-zinc-900 dark:bg-zinc-800 py-20" {...fadeInRight}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl text-primary font-bold mb-10">Arsenal</h2>
        <h2 className="text-1xl text-white font-bold mb-10">Engineered Solutions &#9670; System Components &#9670; Beyond the Basics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Web Applications",
              desc: "Forget off-the-shelf. We build high-performance, scalable web applications designed around your unique needs.",
              list: ["Sleek, Intuitive UX", "Enterprise-Grade Scalability", "Feature-Rich Customization"],
              link: `/landing/noetic-web-apps`,
            },
            {
              title: "Custom Digital Tools",
              desc: "Need a specialized tool? From dynamic calculators to support ticket systems, we build solutions that streamline your workflow.",
              list: ["Interactive Calculators", "Data Visualization Dashboards", "Automated Support Systems"],
              link: `/landing/noetic-custom-tools`,
            },
            {
              title: "Automation & Web Scraping",
              desc: "Eliminate repetitive tasks, gather critical data, and optimize your operations with our automation expertise.",
              list: ["Automated Data Collection", "Task Automation", "Efficient Data Processing"],
              link: `/landing/noetic-automation`,
            },
            {
              title: "Noetic Marketing",
              desc: "Your audience won’t find you by accident. We create data-driven marketing strategies that amplify your brand’s reach.",
              list: ["Paid Ads (PPC, SMM)", "SEO & High-Authority Backlinks", "Conversion-Optimized Content"],
              link: `/landing/noetic-marketing`,
            },
            {
              title: "Seamless API Integrations",
              desc: "Connect, sync, and enhance your digital ecosystem with frictionless API integrations tailored for efficiency.",
              list: ["Third-Party API Connections", "Real-Time Data Sync", "Secure & Scalable Solutions"],
              link: `/landing/noetic-api-integrations`,
            },
            {
              title: "Custom Chrome Extensions",
              desc: "Boost productivity, streamline tasks, and create browser-based tools that work the way you need them to.",
              list: ["Data Storage & Automation", "Advanced Bookmarking", "Custom Browsing Enhancements"],
              link: `/landing/noetic-chrome-extensions`,
            },
          ].map((service, index) => (
            <div key={index} className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center justify-around h-full">
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{service.desc}</p>
                <ul className="list-disc list-inside mb-4">
                  {service.list.map((item, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
                  ))}
                </ul>
                <a href={service.link} className="text-primary text-lg hover:underline">
                  Learn More &#9670;</a>

              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section >
  );
};

export default ServicesSection;