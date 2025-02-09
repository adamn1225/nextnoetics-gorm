import React from "react";
import ClientCms from "@components/client/ClientCms";
import DashboardLayout from '../UserLayout';

const ClientCmsPage = () => {
    return (
        <DashboardLayout>
            <ClientCms />
        </DashboardLayout>
    );
};

export default ClientCmsPage;