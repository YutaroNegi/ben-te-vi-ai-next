"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { MdAdd } from "react-icons/md";
import { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const t = useTranslations("TransactionsTable");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        openMenuId &&
        !target.closest(`#menu-container-${openMenuId}`) &&
        !target.closest(`#toggle-button-${openMenuId}`)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openMenuId]);

  const headers = [
    t("headers.category"),
    t("headers.description"),
    t("headers.date"),
    t("headers.amount"),
    t("headers.actions"),
  ];

  const rows = transactions.map((tx) => [
    tx.category,
    tx.description,
    tx.date,
    tx.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    <div key="actions" className="grid place-items-center cursor-pointer">
      <MdAdd color={tx.imported ? "grey" : "green"} />
    </div>,
  ]);

  return (
    <Table
      title={t("title")}
      headers={headers}
      rows={rows}
      columnWidths={["20%", "50%", "20%", "10%", "20%"]}
      openMenuId={openMenuId}
      setOpenMenuId={setOpenMenuId}
    />
  );
};

export default TransactionsTable;
