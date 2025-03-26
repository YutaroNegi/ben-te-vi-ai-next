import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "@/utils/auth";
import { useExpensesStore } from "@/stores/expenseStore";
import { useTranslations } from "next-intl";
import { Installment } from "@/types";
function Header() {
  const [lastInstallment, setLastInstallment] = useState<Installment | null>(
    null,
  );
  const [lastInsertedDate, setLastInsertedDate] = useState<Date | null>(null);

  const { latestInstallment } = useExpensesStore();
  const t = useTranslations("AuthPage");

  useEffect(() => {
    if (latestInstallment) {
      setLastInstallment(latestInstallment);
      setLastInsertedDate(new Date(latestInstallment.expense.created_at));
    }
  }, [latestInstallment]);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="flex items-center justify-between pr-5 pl-5 shadow-md bg-matcha-900">
      <Image
        src="/bem-te-vi-head.png"
        alt="Logo do App"
        width={80}
        height={80}
      />

      <p className="text-white text-sm">
        {(() => {
          const lastExpenseText = lastInstallment
            ? `${t("lastExpense")}: ${lastInstallment.expense.name} |`
            : "";
          return lastInsertedDate
            ? `${lastExpenseText} ${new Date(lastInsertedDate).toLocaleString()}`
            : "";
        })()}
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
