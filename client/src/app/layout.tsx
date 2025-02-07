"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import useModeStore from "@/state/mode.state";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/state/auth";
import { useEffect } from "react";
import useProjectStore from "@/state/project.state";
import { useShallow } from "zustand/shallow";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mode = useModeStore((state) => state.isDarkMode);
  const getCurrentUserDetails = useAuthStore(
    (state) => state.getCurrentUserDetails,
  );
  const { clearProjectDetails } = useProjectStore(
    useShallow((state) => ({ clearProjectDetails: state.clearProjectDetails })),
  );
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/registration") {
      getCurrentUserDetails();
    }
  }, [pathname, getCurrentUserDetails]);
  useEffect(() => {
    const body = document.getElementById("html");
    
    if (pathname.startsWith("/projects")) {
      body?.style.setProperty("overflow", "hidden");
      // alert("hi");
    } else {
      body?.style.removeProperty("overflow");
    }
  }, [pathname]);
  
  useEffect(() => {
    if (pathname !== "/projects") {
      clearProjectDetails();
    }
  }, [pathname, clearProjectDetails]);

  return (
    <html id="html" lang="en">
      <body className={inter.className + " " + mode}>
        {pathname === "/registration" ? (
          <>{children}</>
        ) : (
          <DashboardWrapper>{children}</DashboardWrapper>
        )}
      </body>
    </html>
  );
}
