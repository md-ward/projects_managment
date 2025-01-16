import { useAuthStore } from "@/state/auth";
import { redirect } from "next/navigation";
import React from "react";
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <p>Loading...</p>; // Show a spinner or loading screen
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
