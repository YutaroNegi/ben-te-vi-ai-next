import React from "react";
import Image from "next/image";
import { signOut } from "@/utils/auth";
import { useExpensesStore } from "@/stores/expenseStore";
import { useTranslations } from "next-intl";
import { Tooltip } from "react-tooltip";

function Header() {
  const { last10Installments } = useExpensesStore();
  const t = useTranslations("ExpenseTable");

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  const tooltipHtml = (() => {
    if (!last10Installments || last10Installments.length === 0) return "";

    const rows = last10Installments
      .slice(0, 5)
      .map(
        (item) => `
          <tr>
            <td style="padding: 4px 8px; border-bottom: 1px solid #ccc;">${item.expense.name}</td>
            <td style="padding: 4px 8px; border-bottom: 1px solid #ccc;">${new Date(item.expense.created_at).toLocaleDateString()}</td>
          </tr>
        `,
      )
      .join("");

    return `
      <div>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 4px 8px; border-bottom: 2px solid #666;">${t("expense")}</th>
              <th style="text-align: left; padding: 4px 8px; border-bottom: 2px solid #666;">${t("date")}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  })();

  return (
    <header className="flex items-center justify-between pr-5 pl-5 shadow-md bg-matcha-dark">
      <Image
        data-tooltip-id="icon-tooltip"
        data-tooltip-html={tooltipHtml}
        src="/bem-te-vi-head.png"
        alt="Logo do App"
        width={80}
        height={80}
        title=""
      />

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
      <Tooltip id="icon-tooltip" />
    </header>
  );
}

export default Header;
