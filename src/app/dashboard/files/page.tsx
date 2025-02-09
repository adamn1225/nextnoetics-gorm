import React from "react";
import ClientFiles from "@components/client/ClientFiles";
import DashboardLayout from '../UserLayout';

const ClientFilesPage = () => {
    return (
        <DashboardLayout>
            <ClientFiles />
        </DashboardLayout>
    );
};

export default ClientFilesPage;