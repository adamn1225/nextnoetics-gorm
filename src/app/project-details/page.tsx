'use client';
import React from 'react';
import PublicOnboardingForm from '@components/PublicOnboardingForm';
import RootLayout from '../layout';

const PublicOnboardingPage: React.FC = () => {
    return (
        <RootLayout>
            <div className="space-y-20">
                <PublicOnboardingForm />
            </div>
        </RootLayout>
    );
};

export default PublicOnboardingPage;