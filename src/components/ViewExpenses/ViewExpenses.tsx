"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import {
  InstallmentTable,
  LoadingSpinner,
  MonthSelector,
  Modal,
  ExpenseForm,
} from "@/components";
import { useTranslations } from "next-intl";

import { Installment } from "@/types";

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
    setModalOpen(true);
  };

  const handleExpenseFormSubmit = async () => {
    await loadInstallments();
    setModalOpen(false);
    setSelectedInst(null);
  };

  const handleCancelEdit = () => {
    setModalOpen(false);
    setSelectedInst(null);
  };

  const initialExpenseValues = selectedInst
    ? // name?: string;
      // description?: string;
      // created_at?: string;
      // amount?: number;
      // type: ExpenseType;
      // installments?: number;
      // installmentNumber?: number;
      // pluggy_transaction_id?: string;
      // pluggy_installments_reference?: string;
      {
        name: selectedInst.expense?.name ?? "",
        amount: selectedInst.amount,
        description: selectedInst.expense?.description ?? "",
        created_at: new Date(selectedInst.due_date).toISOString().split("T")[0],
        installments: selectedInst.installment_number,
        category_id: selectedInst.expense?.category_id || "",
        type: selectedInst.expense?.type || "expense",
        installment_id: selectedInst.id,
      }
    : undefined;

  return (
    <div className="p-0 m-0 w-full relative">
      <div className="flex items-center justify-around mb-5 flex-row">
        <div className="px-4 py-2 bg-bentenavi-dark text-white rounded">
          {t("monthTotal")} {monthTotal.toFixed(2)}
        </div>
        <div className="flex items-center justify-center">
          <MonthSelector
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="px-4 py-2 bg-bentenavi-dark text-white rounded">
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
            {categories
              .filter(
                (category) =>
                  (installmentsByCategory[category.value] || []).length > 0,
              )
              .map((category) => (
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
        <Modal isOpen={modalOpen} onClose={handleCancelEdit}>
          <ExpenseForm
            type={selectedType}
            initialValue={initialExpenseValues}
            onSubmit={handleExpenseFormSubmit}
            isEdit={true}
          />
          <div className="flex justify-end mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={handleCancelEdit}
            >
              {t("cancel") ?? "Cancelar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewExpenses;
