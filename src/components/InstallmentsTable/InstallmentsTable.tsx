"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { CategoryOption, Installment } from "@/types";
import { useExpensesStore } from "@/stores/expenseStore";
import { toast } from "react-toastify";
import { MdEdit, MdDelete, MdCheck } from "react-icons/md";

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

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        openMenuId &&
        !target.closest(`#menu-container-${openMenuId}`) &&
        !target.closest(`#toggle-button-${openMenuId}`)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenuId]);

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
          className="border p-1 w-full text-xs"
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
          className="border p-1 w-full text-xs"
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
          className="border p-1 w-full text-xs"
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
            className="px-2 py-1 bg-matcha-dark hover:bg-matcha-darker text-white rounded text-xs"
            onClick={handleSave}
          >
            <MdCheck />
          </button>
          <button
            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
            onClick={handleCancel}
          >
            <MdDelete />
          </button>
        </div>,
      ];
    }
    const instNum =
      inst.installment_number.toString() +
      (inst.installment_type === "multi" ? "/" + inst.total_installments : "");
    const instVal = inst.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const expenseTotal = inst.total_purchase_amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const instDisplay =
      instVal + (inst.installment_type === "multi" ? ` (${expenseTotal})` : "");
    return [
      inst.expense?.name || "",
      instNum,
      instDisplay,
      new Date(inst.due_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      <td className="relative" key="actions">
        <button
          id={`toggle-button-${inst.id}`}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => toggleMenu(inst.id)}
        >
          •••
        </button>
        {openMenuId === inst.id && (
          <div
            id={`menu-container-${inst.id}`}
            className="absolute top-[-30] left-full bg-white shadow-md rounded p-2 z-50 border ml-2"
          >
            <button
              className="block w-full text-left p-2 hover:bg-gray-100 text-lg"
              onClick={() => handleEditClick(inst)}
            >
              <MdEdit />
            </button>
            <button
              className="block w-full text-left p-2 hover:bg-gray-100 text-lg"
              onClick={() => handleDeleteClick(inst)}
            >
              <MdDelete />
            </button>
          </div>
        )}
      </td>,
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
      columnWidths={["auto", "auto", "auto", "auto", "auto"]} // define larguras para cada coluna
      setOpenMenuId={setOpenMenuId}
      openMenuId={openMenuId}
    />
  );
};

export default InstallmentTable;
