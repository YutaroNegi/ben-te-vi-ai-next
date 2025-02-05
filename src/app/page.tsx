"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:flex-1 bg-almond-900">
        {/* TODO: Inserir o logo ou imagem desejada */}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AuthForm/>
      </div>
    </main>
  );
}