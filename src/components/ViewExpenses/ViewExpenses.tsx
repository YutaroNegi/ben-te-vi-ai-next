"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { InstallmentTable, LoadingSpinner } from "@/components";

import "react-toastify/dist/ReactToastify.css";

// IMPORTS para o react-multi-carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Importante: se usar toastify
import "react-toastify/dist/ReactToastify.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1366 }, // Ajuste conforme desejar
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

  // Carrega parcelas ao mudar de mês ou user
  useEffect(() => {
    loadInstallments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedDate]);

  // Lógica de navegação de mês
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

      {/* Carrossel de categorias */}
      {categories.length > 0 && (
        <Carousel
        
          swipeable
          draggable
          showDots={false}
          responsive={responsive}
          ssr={true} // habilita server-side-rendering (caso precise)
          infinite={false}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all 0.5s"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {categories.map((category) => (
            <div key={category.value} className="px-2">
              <InstallmentTable
                category={category}
                installments={installmentsByCategory[category.value] || []}
                onRefresh={loadInstallments}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ViewExpenses;
