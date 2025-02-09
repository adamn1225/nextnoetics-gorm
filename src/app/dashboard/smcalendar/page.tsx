'use client';
import React from "react";
import SMMCalendar from "@components/SMMCalendar";
import DashboardLayout from '../UserLayout';

const CMS = () => {
    return (
        <DashboardLayout>
            <SMMCalendar />
        </DashboardLayout>
    );
};

export default CMS;