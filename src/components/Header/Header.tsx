import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/utils/auth";
import { useExpensesStore } from "@/stores/expenseStore";
import { useTranslations } from "next-intl";
import { Tooltip } from "react-tooltip";
import { GrConnectivity } from "react-icons/gr";
import { BsFiletypeCsv } from "react-icons/bs";

function Header() {
  const { last10Installments, selectedType } = useExpensesStore();
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
            <td style="padding: 4px 8px; border-bottom: 1px solid #ccc;">${item.amount.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              },
            )}</td>
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
              <th style="text-align: left; padding: 4px 8px; border-bottom: 2px solid #666;">${selectedType === "expense" ? t("expense") : t("income")}</th>
              <th style="text-align: center; padding: 4px 8px; border-bottom: 2px solid #666;">${t("headers.value")}</th>
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
      <Link href="/" className="flex items-center space-x-2">
        <Image
          data-tooltip-id="icon-tooltip"
          data-tooltip-html={tooltipHtml}
          src="/bem-te-vi-head.png"
          alt="Logo do App"
          width={80}
          height={80}
          title=""
        />
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/csv">
          <BsFiletypeCsv size={27} color="black" className="cursor-pointer" />
        </Link>
        <Link href="/connect">
          <GrConnectivity size={27} color="black" className="cursor-pointer" />
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <Image
            src="/logout.svg"
            alt="Logout"
            width={24}
            height={24}
            className="h-6 w-6"
          />
        </button>
      </div>

      <Tooltip id="icon-tooltip" />
    </header>
  );
}

export default Header;
