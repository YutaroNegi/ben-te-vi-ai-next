"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Pluggy, Header, Button } from "@/components";

export default function ConnectPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [show, setShow] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">
            <Link href="/" className="text-blue-500 underline">
              log in
            </Link>
            to connect your account.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <Button
        onClick={() => setShow(!show)}
        className="m-4 p-2 bg-blue-500 text-white rounded"
        label="Pluggy Connect"
      />

      <Pluggy show={show} />
    </>
  );
}
