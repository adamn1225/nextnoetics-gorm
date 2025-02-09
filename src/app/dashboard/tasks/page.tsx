'use client';
import React from "react";
import ClientTasks from "@components/client/ClientTasks";
import DashboardLayout from '../UserLayout';

const ClientTasksPage = () => {
    return (
        <DashboardLayout>
            <ClientTasks />
        </DashboardLayout>
    );
};

export default ClientTasksPage;