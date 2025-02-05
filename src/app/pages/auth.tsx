"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AuthPage() {
  const t = useTranslations("AuthPage");

  return (
    <main className="flex flex-col md:flex-row max-h-screen">
      <div className="hidden md:flex md:flex-col md:flex-1 bg-almond-900 p-4">
        <div className="relative flex-1">
          <Image
            src="/ben-te-vi-logo.png"
            alt="Ben-te-vi Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-4 text-center max-w-[70%] mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AuthForm />
      </div>
    </main>
  );
}
