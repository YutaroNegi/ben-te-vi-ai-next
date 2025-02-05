"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { AuthPage, DashboardPage } from "@/app/pages";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <DashboardPage /> : <AuthPage />
}
