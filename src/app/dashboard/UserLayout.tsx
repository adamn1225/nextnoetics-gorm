'use client';
import Sidebar from '@components/Sidebar'; // Adjust path if needed
import TopNav from '@components/TopNav'; // Import the TopNav component
import React, { ReactNode, useEffect, useState } from 'react';
import { DarkModeProvider } from "@context/DarkModeContext";
import '@styles/tailwind.css'; // Import global styles

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <DarkModeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </DarkModeProvider>
  );
};

export default DashboardLayout;