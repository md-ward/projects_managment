"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useSidebarStore from "@/state/sidebar.state";
import AlertPopup from "@/components/Alert";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed,
  );

  
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <AlertPopup />
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 duration-150 ease-in-out dark:bg-dark-bg ${
          isSidebarCollapsed ? "md:pl-0" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardWrapper;
