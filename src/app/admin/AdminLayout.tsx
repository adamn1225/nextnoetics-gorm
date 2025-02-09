import AdminSidebar from '@components/AdminSidebar'; // Adjust path if needed
import React, { ReactNode } from 'react';
import { DarkModeProvider } from "@context/DarkModeContext";
import '@styles/tailwind.css'; // Import global styles

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <DarkModeProvider>
            <div className="flex min-h-screen">
                <div className='fixed left-0 h-full'><AdminSidebar /></div>
                <div className="flex-1 ml-0 mt-32 md:mt-20 xl:ml-32 p-4 z-0 relative">
                    {children}
                </div>
            </div>
        </DarkModeProvider>
    );
};

export default AdminLayout;