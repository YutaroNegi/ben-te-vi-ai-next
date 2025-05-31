"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Table } from "@/components";
import { CategoryOption, Installment } from "@/types";
import { useExpensesStore } from "@/stores/expenseStore";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface InstallmentTableProps {
  category: CategoryOption;
  installments: Installment[];
  onRefresh: () => void;
  onEdit: (inst: Installment) => void;
}

const InstallmentTable: React.FC<InstallmentTableProps> = ({
  category,
  installments,
  onRefresh,
  onEdit,
}) => {
  const t = useTranslations("ExpenseTable");

  // Calcula o total dos valores das parcelas desta categoria
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);

  // Acesso à store para editar e deletar installments
  const { deleteOneInstallment } = useExpensesStore();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    setOpenMenuId(null);
    onEdit(inst);
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

  // Definição dos cabeçalhos da tabela
  const headers = [
    t("headers.expense"),
    t("headers.installment"),
    t("headers.value"),
    t("headers.dueDate"),

    t("headers.actions"),
  ];

  // Mapeia as linhas (rows) da tabela, sem edição inline
  const rows = installments.map((inst) => {
    const desc = inst.expense?.description || "";
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

    const dueDate = new Date(inst.due_date + "T00:00:00");
    return [
      <span
        data-tooltip-id="my-tooltip"
        data-tooltip-content={desc}
        key="expenseName"
      >
        {inst.expense?.name || ""}
      </span>,
      instNum,
      instDisplay,
      new Date(dueDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      <div
        className="relative text-center grid place-items-center"
        key="actions"
      >
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
      </div>,
    ];
  });

  return (
    <>
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
      <ReactTooltip id="my-tooltip" />
    </>
  );
};

export default InstallmentTable;
