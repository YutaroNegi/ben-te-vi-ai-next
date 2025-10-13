"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import {
  Filter,
  InstallmentTable,
  LoadingSpinner,
  MonthSelector,
  Modal,
  ExpenseForm,
} from "@/components";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Installment } from "@/types";

import "react-toastify/dist/ReactToastify.css";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";

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
  const [filterMode, setFilterMode] = useState(false);
  const [filters, setFilters] = useState<{
    searchTerm: string;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }>({ searchTerm: "" });

  const updateFilters = React.useCallback(
    (changes: Partial<typeof filters>) =>
      setFilters((prev) => ({ ...prev, ...changes })),
    [],
  );

  // modal de confirmação de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllChecked, setDeleteAllChecked] = useState(false);
  const [instToDelete, setInstToDelete] = useState<Installment | null>(null);

  const {
    categories,
    installmentsByCategory,
    loading,
    fetchCategories,
    fetchInstallments,
    deleteOneInstallment,
    deleteExpense,
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

  // loadInstallments (fora do filterMode)
  const loadInstallments = React.useCallback(async () => {
    if (!userId) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();

    // ORDEM: (userId, type, startDate, endDate)
    await fetchInstallments(userId, selectedType, startDate, endDate);
  }, [userId, selectedDate, fetchInstallments, selectedType]);

  useEffect(() => {
    if (!filterMode) {
      // só atualiza pelo mês quando NÃO está no modo filtro
      loadInstallments();
    }
  }, [loadInstallments, filterMode]);

  useEffect(() => {
    if (!userId || !filterMode) return;

    // ORDEM: (userId, type, startDate?, endDate?, opts?)
    fetchInstallments(
      userId,
      selectedType,
      filters.startDate,
      filters.endDate,
      {
        categoryId: filters.categoryId,
        searchTerm: filters.searchTerm,
      },
    ).catch(console.error);
  }, [
    userId,
    filterMode,
    selectedType,
    filters.startDate,
    filters.endDate,
    filters.categoryId,
    filters.searchTerm,
    fetchInstallments,
  ]);
  const toggleFilterMode = () => {
    setFilterMode((prev) => {
      const next = !prev;
      // ao sair do modo filtro, volta para a visão mensal
      if (!next) loadInstallments();
      return next;
    });
  };

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

  const handleRequestDelete = (inst: Installment) => {
    setInstToDelete(inst);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!instToDelete) return;

    const deleteFunc = deleteAllChecked
      ? () => deleteExpense(instToDelete.expense_id)
      : () => deleteOneInstallment(instToDelete.id);

    try {
      await deleteFunc();
      toast.success(t("toast.deleted"));
      await loadInstallments();
    } catch (error) {
      console.error("Erro ao deletar installment:", error);
      toast.error(t("toast.errorDeleting"));
    } finally {
      setDeleteModalOpen(false);
      setDeleteAllChecked(false);
      setInstToDelete(null);
    }
  };

  const initialExpenseValues = selectedInst
    ? {
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
      <button
        className="flex items-center mb-4 px-3 py-1 bg-bentenavi-dark text-white rounded hover:bg-gray-400 transition-colors ml-auto my-0"
        onClick={toggleFilterMode}
      >
        <FaFilter className="mr-2" />
        {filterMode ? t("buttons.hideFilter") : t("buttons.showFilter")}
      </button>

      {filterMode && (
        <Filter
          categories={categories}
          values={filters}
          onChange={updateFilters}
        />
      )}

      {!filterMode && (
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
      )}

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
                    onEdit={handleEditInstallment}
                    onRequestDelete={handleRequestDelete}
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

      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <p>{t("confirmDelete.message")}</p>

          {instToDelete?.total_installments &&
            instToDelete.total_installments > 1 && (
              <label className="flex items-center mt-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={deleteAllChecked}
                  onChange={(e) => setDeleteAllChecked(e.target.checked)}
                />
                {t("confirmDelete.deleteAllCheckbox")}
              </label>
            )}

          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t("buttons.cancel")}
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={confirmDelete}
            >
              {t("buttons.delete")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewExpenses;
