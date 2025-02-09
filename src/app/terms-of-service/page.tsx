'use client';
import React from 'react';
import LandingNavigation from '@components/LandingNavigation';

const TermsOfServicePage = () => {
    return (
        <>
            <LandingNavigation />
            <div className="container mx-auto border text-gray-700 dark:text-primary border-gray-200 shadow-sm my-32 p-8">
                <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">Last Updated: 02-03-2025</p>
                <p className="mb-4">
                    Welcome to DeadGenerics.com (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our platform, which provides 
                    services such as **task management, SMM marketing calendar scheduling, headless CMS, analytics integrations, and other business tools**.
                </p>

                <h2 className="text-xl font-semibold mb-2">1. Account Registration & Google Sign-In</h2>
                <p className="mb-4">
                    You may register an account using your email or sign in through **Google Single Sign-On (SSO)**. By using Google SSO, you agree to comply with Google’s Terms of Service 
                    and Privacy Policy.
                </p>
                <p className="mb-4">
                    When signing in with Google, we access:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Your profile picture</li>
                </ul>
                <p className="mb-4">
                    We do not store or share sensitive Google data beyond authentication purposes.
                </p>

                <h2 className="text-xl font-semibold mb-2">2. Acceptable Use</h2>
                <p className="mb-4">
                    By using our Service, you agree **not** to:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Use our platform for illegal or unauthorized activities.</li>
                    <li>Share malware, harmful software, or security exploits.</li>
                    <li>Violate third-party rights, including Google API policies.</li>
                    <li>Use automation (bots, scrapers) without authorization.</li>
                    <li>Misrepresent your identity or engage in fraudulent activity.</li>
                </ul>
                <p className="mb-4">
                    Violations may result in account suspension or termination.
                </p>

                <h2 className="text-xl font-semibold mb-2">3. User Content & Data Handling</h2>
                <p className="mb-4">
                    Our platform allows users to create **tasks, manage schedules, store CMS content, and integrate analytics**.
                </p>
                <p className="mb-4">
                    We do not claim ownership of your uploaded content. However, by using the Service, you grant us a **limited license** to store and process data necessary for platform functionality.
                </p>

                <h2 className="text-xl font-semibold mb-2">4. Third-Party Integrations</h2>
                <p className="mb-4">
                    Our Service integrates with **Google APIs, Google Analytics, and marketing tools**. By using these features, you acknowledge that third-party terms apply.
                </p>
                <p className="mb-4">
                    **Google API Compliance:**
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>We do not request restricted Google scopes.</li>
                    <li>We do not store or use Google OAuth tokens beyond authentication.</li>
                    <li>Google user data is not sold, rented, or shared beyond authentication needs.</li>
                </ul>

                <h2 className="text-xl font-semibold mb-2">5. Service Availability & Limitations</h2>
                <p className="mb-4">
                    We strive for 99.9% uptime, but do **not guarantee uninterrupted access**.
                </p>
                <p className="mb-4">
                    We may suspend or terminate accounts for violating these Terms or engaging in malicious activity.
                </p>

                <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
                <p className="mb-4">
                    To the maximum extent permitted by law, **DeadGenerics** is **not liable** for:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Data loss, interruptions, or unauthorized access.</li>
                    <li>Third-party service failures (Google API, analytics, hosting).</li>
                    <li>Any indirect, incidental, or consequential damages.</li>
                </ul>

                <h2 className="text-xl font-semibold mb-2">7. Changes to These Terms</h2>
                <p className="mb-4">
                    We may update these Terms periodically. Users will be notified of material changes via email or in-app notifications.
                </p>

                <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about these Terms, contact us at **[Your Contact Email]**.
                </p>
            </div>
            <footer className="bg-gray-950 text-white py-6">
                <div className="container mx-auto text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} DeadGenerics. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default TermsOfServicePage;
