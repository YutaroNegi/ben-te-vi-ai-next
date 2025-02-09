"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { InstallmentTable } from "@/components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewExpenses = () => {
  const userId = useAuthStore((state) => state.user?.id);

  // Store
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

  // Carrega installments sempre que selectedDate ou userId mudar
  useEffect(() => {
    loadInstallments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ------------------------------
  // LÓGICA DO CARROSSEL
  // ------------------------------
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Ajusta quantos itens por página conforme o tamanho da tela
  useEffect(() => {
    function updateItemsPerPage() {
      const width = window.innerWidth;

      if (width < 640) {
        // Ex: telas bem pequenas
        setItemsPerPage(1);
      } else if (width < 1024) {
        // Ex: telas médias
        setItemsPerPage(2);
      } else if (width < 1280) {
        // Ex: telas grandes
        setItemsPerPage(3);
      } else {
        // Ex: telas muito grandes
        setItemsPerPage(4);
      }
    }

    updateItemsPerPage(); // atualiza já na primeira montagem
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Calcula número total de slides
  const totalSlides = Math.ceil(categories.length / itemsPerPage);

  // Funções de navegação
  const handlePrevSlideCarousel = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlideCarousel = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  // Fatiar as categorias para exibir somente as do "slide" atual
  const startIndex = currentSlide * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCategories = categories.slice(startIndex, endIndex);

  return (
    <div className="p-0 m-0">
      <ToastContainer />

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

      {loading && <p className="text-center">Carregando...</p>}

      {/* Controles do carrossel */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center space-x-4 mb-4 ">
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
      )}

      {/* Mostra apenas as categorias "visíveis" no slide atual */}
      <div className="flex space-x-4 justify-center">
        {visibleCategories.map((category) => (
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