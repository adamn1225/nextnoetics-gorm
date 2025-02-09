import React from "react";
import ClientAnalytics from "@components/client/ClientAnalytics";
import DashboardLayout from '../UserLayout';

const AnalyticsPage = () => {
    return (
        <DashboardLayout>
            <ClientAnalytics />
        </DashboardLayout>
    );
};

export default AnalyticsPage;