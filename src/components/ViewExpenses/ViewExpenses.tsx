"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { InstallmentTable } from "@/components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewExpenses = () => {
  const userId = useAuthStore((state) => state.user?.id);

  // Agora pegamos tudo do store
  const {
    categories,
    installmentsByCategory,
    loading,
    fetchCategories,
    fetchInstallments,

    // Adicionado no store
    selectedDate,
    setSelectedDate,
  } = useExpensesStore();

  // Carrega categories 1x
  useEffect(() => {
    if (userId) {
      fetchCategories(userId).catch(console.error);
    }
  }, [userId, fetchCategories]);

  // Carrega installments sempre que selectedDate ou userId mudar
  useEffect(() => {
    loadInstallments();
  }, [userId, selectedDate]);

  const loadInstallments = async () => {
    if (!userId) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();
    await fetchInstallments(userId, startDate, endDate);
  };

  const handlePrevMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    setSelectedDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="p-4">
      <ToastContainer />

      <div className="flex items-center justify-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-gray-300 rounded-l hover:bg-gray-400 transition-colors"
        >
          &#8592;
        </button>
        <div className="px-4 py-2 bg-gray-200">
          {selectedDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 bg-gray-300 rounded-r hover:bg-gray-400 transition-colors"
        >
          &#8594;
        </button>
      </div>

      {loading && <p className="text-center">Carregando...</p>}

      <div className="flex space-x-4 overflow-x-auto">
        {categories.map((category) => (
          <InstallmentTable
            key={category.value}
            category={category}
            installments={installmentsByCategory[category.value] || []}
            onRefresh={loadInstallments}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewExpenses;