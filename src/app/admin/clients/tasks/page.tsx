'use client';
import React from 'react';
import AdminTasksPage from '@/components/AdminTasksPage';
import AdminLayout from '../../AdminLayout';

const AdminTaskPage = () => {
    return (
        <AdminLayout>
            <AdminTasksPage />
        </AdminLayout>
    );
};

export default AdminTaskPage;