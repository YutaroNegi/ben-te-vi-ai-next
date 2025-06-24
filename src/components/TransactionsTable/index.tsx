"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { MdAdd } from "react-icons/md";
import { Transaction, InitialExpenseValues } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  setInitialValue?: (value: InitialExpenseValues) => void;
  setShowModal: (show: boolean) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  setInitialValue,
  setShowModal,
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

  const handleActionClick = (tx: Transaction) => {
    if (tx.imported) return;
    const totalInstallments = tx.creditCardMetadata?.totalInstallments ?? 1;
    const totalAmount = tx.amount * totalInstallments;
    const initialValue: InitialExpenseValues = {
      type: "expense",
      name: tx.description,
      description: tx.description,
      created_at: new Date(tx.date).toISOString().split("T")[0],
      amount: totalAmount,
      installments: totalInstallments,
      pluggy_transaction_id: tx.id,
      pluggy_installments_reference: tx.pluggy_installments_reference,
    };
    if (setInitialValue) {
      setInitialValue(initialValue);
      setShowModal(true);
    }
    setOpenMenuId(null);
  };

  const rows = transactions.map((tx) => [
    tx.category,
    tx.description,
    new Date(tx.date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    tx.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    <button
      key="actions"
      className="grid place-items-center cursor-pointer"
      onClick={() => handleActionClick(tx)}
    >
      <MdAdd color={tx.imported ? "grey" : "green"} />
    </button>,
  ]);

  const rowClasses = transactions.map((tx) =>
    tx.imported ? "opacity-50" : "",
  );

  return (
    <Table
      className="w-[80vw] mx-auto"
      title={t("title")}
      headers={headers}
      rows={rows}
      columnWidths={["20%", "50%", "20%", "10%", "20%"]}
      openMenuId={openMenuId}
      setOpenMenuId={setOpenMenuId}
      rowClasses={rowClasses}
      scrollable={true}
      maxHeight="max-h-80"
    />
  );
};

export default TransactionsTable;
