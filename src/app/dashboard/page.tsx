import React from "react";
import ClientDashboard from "@components/client/ClientDashboard";
import DashboardLayout from './UserLayout';

const ClientDashboardPage = () => {
    return (
        <DashboardLayout>
            <ClientDashboard />
        </DashboardLayout>
    );
};

export default ClientDashboardPage;