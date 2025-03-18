import React from "react";
import Image from "next/image";
import { signOut } from "@/utils/auth";
import { useAuthStore } from "@/stores/authStore";
import { useTranslations } from "next-intl";

function Header() {
  const { lastLogin } = useAuthStore();
  const t = useTranslations("AuthPage");

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-matcha-900">
      <Image
        src="/ben-te-vi-logo.png"
        alt="Logo do App"
        width={40}
        height={40}
        className="h-10"
      />

      <p className="text-white text-sm">
        {lastLogin
          ? `${t("lastLogin")}: ${new Date(lastLogin).toLocaleString()}`
          : ""}
      </p>
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        {/* Para o ícone de logout, definindo width e height de acordo com as classes h-6 e w-6 */}
        <Image
          src="/logout.svg"
          alt="Logout"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </button>
    </header>
  );
}

export default Header;
