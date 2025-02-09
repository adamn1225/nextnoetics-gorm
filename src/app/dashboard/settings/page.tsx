import React from "react";
import ClientSettings from "@components/client/ClientSettings";
import DashboardLayout from '../UserLayout';

const ClientSettingsPage = () => {
    return (
        <DashboardLayout>
            <ClientSettings />
        </DashboardLayout>
    );
};

export default ClientSettingsPage;