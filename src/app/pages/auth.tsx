"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import Image from "next/image";

export default function AuthPage() {
  return (
    <main className="flex flex-col md:flex-row max-h-screen">
      <div className="relative hidden md:block md:flex-1 bg-almond-900">
        <Image
          src="/ben-te-vi-logo.png"
          alt="Ben-te-vi Logo"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AuthForm />
      </div>
    </main>
  );
}