'use client';
import React from 'react';
import LandingNavigation from '@components/LandingNavigation';

const PrivacyPolicyPage = () => {
    return (
        <>
            <LandingNavigation />
            <div className="container mx-auto border text-gray-700 dark:text-primary border-gray-200 shadow-sm my-32 p-8">
                <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">Last Updated: 01-24-2025</p>
                <p className="mb-4">
                    Welcome to noetics.io (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting any information you provide when using our application.
                </p>
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <p className="mb-4">
                    When you sign in using Google, we receive:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Your profile picture (if available)</li>
                    <li>Your language preference</li>
                </ul>
                <p className="mb-4">
                    We do not collect financial data, passwords, or any other personal information beyond what Google shares during authentication.
                </p>
                <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                <p className="mb-4">
                    We only use your information to:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Authenticate your login.</li>
                    <li>Personalize your experience in the app.</li>
                    <li>Improve our services.</li>
                </ul>
                <p className="mb-4">
                    We do not sell, share, or distribute your information to third parties.
                </p>
                <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
                <p className="mb-4">
                    We take reasonable precautions to protect your data. However, no method of transmission over the Internet is 100% secure.
                </p>
                <h2 className="text-xl font-semibold mb-2">4. Third-Party Services</h2>
                <p className="mb-4">
                    Our authentication system is powered by Supabase and Google OAuth. These services may collect additional data based on their own privacy policies.
                </p>
                <h2 className="text-xl font-semibold mb-2">5. Your Choices</h2>
                <p className="mb-4">
                    You can revoke access at any time via your Google Account settings.
                </p>
                <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this policy, contact us at [Your Email].
                </p>
            </div>
            <footer className="bg-gray-950 text-white py-6">
                <div className="container mx-auto text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default PrivacyPolicyPage;