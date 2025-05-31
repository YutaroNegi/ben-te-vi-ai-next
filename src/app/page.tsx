"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { AuthPage, DashboardPage } from "@/app/pages";
import { CustomToast } from "@/components";
import { useSupabaseAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  useSupabaseAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      {isAuthenticated ? <DashboardPage /> : <AuthPage />}
      <CustomToast />
    </>
  );
}
