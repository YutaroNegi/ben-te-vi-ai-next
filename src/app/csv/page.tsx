"use client";
import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useSupabaseAuth } from "@/hooks/useAuth";
import { Header, SyncCSV } from "@/components";
export default function ConnectPage() {
  useSupabaseAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">
            <Link href="/" className="text-blue-500 underline">
              log in
            </Link>{" "}
            to connect your account.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <SyncCSV />
    </>
  );
}
