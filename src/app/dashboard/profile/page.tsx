import React from "react";
import ClientProfile from "@components/client/ClientProfile";
import DashboardLayout from '../UserLayout';

const UserProfilePage = () => {
    return (
        <DashboardLayout>
            <ClientProfile />
        </DashboardLayout>
    );
};

export default UserProfilePage;