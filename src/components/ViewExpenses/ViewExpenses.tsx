"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import {
  InstallmentTable,
  LoadingSpinner,
  Input,
  InputDate,
  MonthSelector,
} from "@/components";
import { useTranslations } from "next-intl";

import { Installment } from "@/types";
import { toast } from "react-toastify";
import { MdCheck } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface CustomArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1366 },
    items: 3,
    partialVisibilityGutter: 40,
  },
  laptop: {
    breakpoint: { max: 1366, min: 1024 },
    items: 3,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30,
  },
};

const CustomLeftArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{ position: "absolute", top: "0", left: "10px", zIndex: 1 }}
    className="p-2 bg-bentenavi-dark text-white rounded hover:bg-gray-400 transition-colors"
  >
    <FaArrowLeft size={20} />
  </button>
);

const CustomRightArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{ position: "absolute", top: "0", right: "10px", zIndex: 1 }}
    className="p-2 bg-bentenavi-dark text-white rounded hover:bg-gray-400 transition-colors"
  >
    <FaArrowRight size={20} />
  </button>
);

const ViewExpenses: React.FC = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const t = useTranslations("ExpenseTable");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInst, setSelectedInst] = useState<Installment | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    installment_number: 1,
    amount: 0,
    due_date: "",
    paid: false,
  });

  const {
    categories,
    installmentsByCategory,
    loading,
    fetchCategories,
    fetchInstallments,
    selectedDate,
    setSelectedDate,
    monthTotal,
    selectedType,
    editOneInstallment,
  } = useExpensesStore();

  useEffect(() => {
    if (userId) {
      fetchCategories(userId, selectedType).catch(console.error);
    }
  }, [userId, fetchCategories, selectedType]);

  const loadInstallments = React.useCallback(async () => {
    if (!userId) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();
    await fetchInstallments(userId, startDate, endDate, selectedType);
  }, [userId, selectedDate, fetchInstallments, selectedType]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  const handleEditInstallment = (inst: Installment) => {
    setSelectedInst(inst);
    setEditData({
      name: inst.expense?.name || "",
      installment_number: inst.installment_number,
      amount: inst.amount,
      due_date: new Date(inst.due_date).toISOString().split("T")[0],
      paid: inst.paid,
    });
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setModalOpen(false);
    setSelectedInst(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedInst) return;
    try {
      await editOneInstallment(selectedInst.id, { ...editData });
      toast.success(t("toast.updated"));
      setModalOpen(false);
      setSelectedInst(null);
      await loadInstallments();
    } catch (error) {
      console.error("Erro ao editar installment:", error);
      toast.error(t("toast.errorUpdating"));
    }
  };

  return (
    <div className="p-0 m-0 w-full relative">
      <div className="flex items-center justify-around mb-5 flex-row">
        <div className="px-4 py-2 bg-bentenavi-dark text-white rounded-full">
          {t("monthTotal")} {monthTotal.toFixed(2)}
        </div>
        <div className="flex items-center justify-center">
          <MonthSelector
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="px-4 py-2 bg-bentenavi-dark text-white rounded-full">
          {t("monthTotal")} {monthTotal.toFixed(2)}
        </div>
      </div>

      {loading && (
        <p className="text-center">
          <LoadingSpinner />
        </p>
      )}

      {categories.length > 0 && (
        <div className="relative">
          <Carousel
            swipeable
            draggable
            showDots={false}
            responsive={responsive}
            ssr={true}
            infinite={false}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all 0.5s"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
          >
            {categories.map((category) => (
              <div
                key={category.value}
                className="px-2 w-[25em] mx-auto text-center"
              >
                <InstallmentTable
                  category={category}
                  installments={installmentsByCategory[category.value] || []}
                  onRefresh={loadInstallments}
                  onEdit={handleEditInstallment}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {t("editInstallment")}
            </h2>

            <div className="space-y-3 flex flex-col items-center">
              <Input
                id="name"
                name="name"
                label={t("headers.expense")}
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <Input
                id="installment_number"
                name="installment_number"
                label={t("installment")}
                type="number"
                value={editData.installment_number.toString()}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    installment_number: Number(e.target.value),
                  }))
                }
              />

              <Input
                id="amount"
                name="amount"
                label={t("headers.value")}
                type="number"
                step="0.01"
                value={editData.amount.toString()}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
              />

              <InputDate
                id="due_date"
                name="due_date"
                label={t("headers.dueDate")}
                type="date"
                value={editData.due_date}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    due_date: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={handleCancelEdit}
              >
                {t("cancel") ?? "Cancelar"}
              </button>
              <button
                className="px-3 py-1 bg-matcha-dark text-white rounded"
                onClick={handleSaveEdit}
              >
                <MdCheck />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExpenses;
