"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { fetchInstallmentsByUserAndDate } from "@/utils";
import { Category, Installment } from "@/types";
import { InstallmentTable } from "@/components";
import { ToastContainer } from "react-toastify"; // Para exibir toasts
import "react-toastify/dist/ReactToastify.css";

const ViewExpenses = () => {
  const userId = useAuthStore((state) => state.user?.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [installmentsByCategory, setInstallmentsByCategory] = useState<
    Record<string, Installment[]>
  >({});

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // Função que carrega as parcelas
  const loadInstallments = async () => {
    if (!userId) return;
    try {
      setLoading(true);

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 1).toISOString();

      const grouped = await fetchInstallmentsByUserAndDate(
        userId,
        startDate,
        endDate
      );
      setInstallmentsByCategory(grouped);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    // Carrega as categorias
    setLoading(true);
    fetch(`/api/categories/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
        setLoading(false);
      });
  }, [userId]);

  // Sempre que mudar userId ou selectedDate, recarrega parcelas
  useEffect(() => {
    loadInstallments();
  }, [userId, selectedDate]);

  const handlePrevMonth = () => {
    setSelectedDate((prevDate) => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      return new Date(year, month + 1, 1);
    });
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
            key={category.id}
            category={category}
            installments={installmentsByCategory[category.id] || []}
            onRefresh={loadInstallments}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewExpenses;
