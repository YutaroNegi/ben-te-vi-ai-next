"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { CategoryOption, Installment } from "@/types";
import { useExpensesStore } from "@/stores/expenseStore";
import { toast } from "react-toastify";

interface InstallmentTableProps {
  category: CategoryOption;
  installments: Installment[];
  onRefresh: () => void;
}

const InstallmentTable: React.FC<InstallmentTableProps> = ({
  category,
  installments,
  onRefresh,
}) => {
  const t = useTranslations("ExpenseTable");

  // Calcula o total dos valores das parcelas desta categoria
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);

  // Acesso à store para editar e deletar installments
  const { editOneInstallment, deleteOneInstallment } = useExpensesStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    installment_number: number;
    amount: number;
    due_date: string;
    paid: boolean;
  }>({
    installment_number: 1,
    amount: 0,
    due_date: "",
    paid: false,
  });

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEditClick = (inst: Installment) => {
    setEditingId(inst.id);
    setOpenMenuId(null);
    setEditData({
      installment_number: inst.installment_number,
      amount: inst.amount,
      due_date: new Date(inst.due_date).toISOString().split("T")[0],
      paid: inst.paid,
    });
  };

  const handleDeleteClick = async (inst: Installment) => {
    setOpenMenuId(null);
    try {
      await deleteOneInstallment(inst.id);
      toast.success(t("toast.deleted"));
      onRefresh();
    } catch (error) {
      console.error("Erro ao deletar installment:", error);
      toast.error(t("toast.errorDeleting"));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await editOneInstallment(editingId, { ...editData });
      toast.success(t("toast.updated"));
      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.error("Erro ao editar installment:", error);
      toast.error(t("toast.errorUpdating"));
    }
  };

  // Definição dos cabeçalhos da tabela
  const headers = [
    t("headers.expense"),
    t("headers.installment"),
    t("headers.value"),
    t("headers.dueDate"),
    t("headers.actions"),
  ];

  // Mapeia as linhas (rows) da tabela, com tratamento para edição
  const rows = installments.map((inst) => {
    const isEditing = editingId === inst.id;
    if (isEditing) {
      return [
        <span key="expenseName">{inst.expense?.name || ""}</span>,
        <input
          key="installmentNumber"
          type="number"
          className="border p-1 w-full"
          value={editData.installment_number}
          onChange={(e) =>
            setEditData((prev) => ({
              ...prev,
              installment_number: Number(e.target.value),
            }))
          }
        />,
        <input
          key="amount"
          type="number"
          step="0.01"
          className="border p-1 w-full"
          value={editData.amount}
          onChange={(e) =>
            setEditData((prev) => ({
              ...prev,
              amount: Number(e.target.value),
            }))
          }
        />,
        <input
          key="dueDate"
          type="date"
          className="border p-1 w-full"
          value={editData.due_date}
          onChange={(e) =>
            setEditData((prev) => ({
              ...prev,
              due_date: e.target.value,
            }))
          }
        />,
        <div key="actions" className="flex space-x-2">
          <button
            className="px-2 py-1 bg-green-500 text-white rounded"
            onClick={handleSave}
          >
            {t("actions.save")}
          </button>
          <button
            className="px-2 py-1 bg-gray-400 text-white rounded"
            onClick={handleCancel}
          >
            {t("actions.cancel")}
          </button>
        </div>,
      ];
    }

    // Linha padrão (não em edição)
    return [
      inst.expense?.name || "",
      inst.installment_number.toString(),
      inst.amount.toFixed(2),
      new Date(inst.due_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      <div key="menu" className="relative">
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => toggleMenu(inst.id)}
        >
          •••
        </button>
        {openMenuId === inst.id && (
          <div
            className="absolute top-10 right-0 bg-white shadow-md rounded p-2 z-50 border"
            style={{ minWidth: "100px" }}
          >
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              onClick={() => handleEditClick(inst)}
            >
              {t("actions.edit")}
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              onClick={() => handleDeleteClick(inst)}
            >
              {t("actions.delete")}
            </button>
          </div>
        )}
      </div>,
    ];
  });

  return (
    <Table
      title={`${category.label} - ${totalAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`}
      headers={headers}
      rows={rows}
      columnWidths={["auto", "10%", "auto", "auto", "auto"]} // define larguras para cada coluna
    />
  );
};

export default InstallmentTable;
