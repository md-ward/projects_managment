"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import useModeStore from "@/state/mode.state";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/state/auth";
import { useEffect } from "react";

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
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/registration") {
      getCurrentUserDetails();
    }
  }, [pathname, getCurrentUserDetails]);

  return (
    <html lang="en">
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
