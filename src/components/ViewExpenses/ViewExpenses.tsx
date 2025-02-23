"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { InstallmentTable, LoadingSpinner } from "@/components";

import "react-toastify/dist/ReactToastify.css";

const ViewExpenses = () => {
  const userId = useAuthStore((state) => state.user?.id);

  const {
    categories,
    installmentsByCategory,
    loading,
    fetchCategories,
    fetchInstallments,
    selectedDate,
    setSelectedDate,
  } = useExpensesStore();

  // Carrega as categorias ao montar
  useEffect(() => {
    if (userId) {
      fetchCategories(userId).catch(console.error);
    }
  }, [userId, fetchCategories]);

  const loadInstallments = async () => {
    if (!userId) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();
    await fetchInstallments(userId, startDate, endDate);
  };

  useEffect(() => {
    loadInstallments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedDate]);

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = window.innerWidth >= 1366 ? 4 : 3;

  const totalSlides = Math.ceil(categories.length / itemsPerPage);

  const handlePrevSlideCarousel = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlideCarousel = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  // Cálculo do tamanho do track e da translação para alinhar o último slide
  const trackWidthPercentage = (categories.length * 100) / itemsPerPage; // largura total do track em %
  const maxTranslation = trackWidthPercentage - 100; // quanto o track pode se mover (em %)
  const transformPercentage =
    totalSlides > 1 ? -(currentSlide / (totalSlides - 1)) * maxTranslation : 0;

  return (
    <div className="p-0 m-0 w-full">
      {/* Navegador de mês */}
      <div className="flex items-center justify-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-bentenavi-900 text-white rounded-l hover:bg-gray-400 transition-colors"
        >
          &#8592;
        </button>
        <div className="px-4 py-2 bg-bentenavi-900 text-white">
          {selectedDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 bg-bentenavi-900 text-white rounded-r hover:bg-gray-400 transition-colors"
        >
          &#8594;
        </button>
      </div>

      {loading && (
        <p className="text-center">
          <LoadingSpinner />
        </p>
      )}

      {categories.length > 0 && (
        <>
          {/* Controles do carrossel */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={handlePrevSlideCarousel}
              disabled={currentSlide === 0}
              className={`px-3 py-1 rounded ${
                currentSlide === 0
                  ? "bg-bentenavi-900 text-white text-gray-500 cursor-not-allowed"
                  : "bg-matcha-900 text-white hover:bg-matcha-700"
              }`}
            >
              Prev
            </button>

            <div>
              {currentSlide + 1} / {totalSlides}
            </div>

            <button
              onClick={handleNextSlideCarousel}
              disabled={currentSlide === totalSlides - 1}
              className={`px-3 py-1 rounded ${
                currentSlide === totalSlides - 1 || totalSlides === 0
                  ? "bg-bentenavi-900 text-white text-gray-500 cursor-not-allowed"
                  : "bg-matcha-900 text-white hover:bg-matcha-700"
              }`}
            >
              Next
            </button>
          </div>

          {/* Carrossel com animação */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${transformPercentage}%)`,
                width: `100%`,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.value}
                  className="px-0 flex justify-center" // Remove espaçamento horizontal para aproximar as tabelas
                  style={{
                    flex: `0 0 ${100 / 4}%`,
                  }}
                >
                  <div className="min-w-[300px] max-w-[300px]">
                    <InstallmentTable
                      category={category}
                      installments={
                        installmentsByCategory[category.value] || []
                      }
                      onRefresh={loadInstallments}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewExpenses;
