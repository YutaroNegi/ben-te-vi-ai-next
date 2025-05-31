"use client";

import React, { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/authStore";
import { AuthPage, DashboardPage } from "@/app/pages";
import { CustomToast } from "@/components";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const { user } = data.session;
        useAuthStore.getState().login({
          id: user.id,
          email: user.email ?? "",
          lastLogin: user.last_sign_in_at,
        });
      }
    });
  }, []);

  return (
    <>
      {isAuthenticated ? <DashboardPage /> : <AuthPage />}
      <CustomToast />
    </>
  );
}
