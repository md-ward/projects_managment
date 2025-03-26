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
import { SocketContextProvider } from "@/context/socketProvider";
import ChattingElement from "@/components/Chating";
import { useChatStore } from "@/components/Chating/mockState/state";

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

  const { isChatModalOpen, closeChatModal } = useChatStore(
    useShallow((state) => ({
      isChatModalOpen: state.isChatModalOpen,
      closeChatModal: state.closeChatModal,
    })),
  );
  
  return (
    <html id="html" lang="en">
      <body className={inter.className + " " + mode}>
        {pathname === "/registration" ? (
          <>{children}</>
        ) : (
          <SocketContextProvider
            socketUrls={[`localhost:8002`]}
          >
            <DashboardWrapper>{children}</DashboardWrapper>
            <ChattingElement
              AnchorEl="BottomRight"
              withAnimation={false}
              isChatModalOpen={isChatModalOpen}
              closeChatModal={closeChatModal}
            />
          </SocketContextProvider>
        )}
      </body>
    </html>
  );
}
