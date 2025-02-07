"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { Category, Installment } from "@/types";
import { editInstallment, deleteInstallment } from "@/utils";
import { toast } from "react-toastify";

interface InstallmentTableProps {
  category: Category;
  installments: Installment[];
  onRefresh: () => void; // Função para recarregar a listagem
}

const InstallmentTable: React.FC<InstallmentTableProps> = ({
  category,
  installments,
  onRefresh,
}) => {
  const t = useTranslations("ExpenseTable");

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
      // Transformar a data em yyyy-mm-dd para o <input type="date">
      due_date: new Date(inst.due_date).toISOString().split("T")[0],
      paid: inst.paid,
    });
  };

  const handleDeleteClick = async (inst: Installment) => {
    setOpenMenuId(null);
    try {
      await deleteInstallment(inst.id);
      toast.success(t("toast.deleted")); // Exibe toast de sucesso
      onRefresh(); // Recarrega a listagem do pai
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
      await editInstallment(editingId, { ...editData });
      toast.success(t("toast.updated")); // Sucesso
      setEditingId(null);
      onRefresh(); // Recarrega a tabela
    } catch (error) {
      console.error("Erro ao editar installment:", error);
      toast.error(t("toast.errorUpdating"));
    }
  };

  const headers = [
    t("headers.expense"),
    t("headers.installment"),
    t("headers.value"),
    t("headers.dueDate"),
    t("headers.actions"),
  ];

  const rows = installments.map((inst) => {
    const isEditing = editingId === inst.id;

    if (isEditing) {
      return [
        // Nome da despesa (apenas exibindo, pois estamos editando a parcela)
        <span key="expenseName">{inst.expense?.name || ""}</span>,

        // installment_number
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

        // amount
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

        // due_date
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

        // Ações
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

    // Linha normal
    return [
      inst.expense?.name || "",
      inst.installment_number.toString(),
      inst.amount.toFixed(2),
      new Date(inst.due_date).toLocaleDateString(),
      // Menu 3 pontinhos
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

  return <Table title={category.name} headers={headers} rows={rows} />;
};

export default InstallmentTable;