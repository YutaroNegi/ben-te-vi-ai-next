"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { InstallmentTable, LoadingSpinner } from "@/components";
import { useTranslations } from "next-intl";

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

  const {
    categories,
    installmentsByCategory,
    loading,
    fetchCategories,
    fetchInstallments,
    selectedDate,
    setSelectedDate,
    monthTotal,
  } = useExpensesStore();

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

  // Navegação de mês
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
    <div className="p-0 m-0 w-full relative">
      <div className="flex items-center justify-around mb-5 flex-row">
        <div className="px-4 py-2 bg-bentenavi-dark text-white rounded-full">
          {t("monthTotal")} {monthTotal.toFixed(2)}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-bentenavi-dark text-white rounded-l hover:bg-gray-400 transition-colors"
          >
            &#8592;
          </button>
          <div className="px-4 py-2 bg-bentenavi-dark text-white">
            {selectedDate
              .toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
              .toUpperCase()}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-bentenavi-dark text-white rounded-r hover:bg-gray-400 transition-colors"
          >
            &#8594;
          </button>
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
              <div key={category.value} className="px-2 w-[25em] mx-auto text-center">
                <InstallmentTable
                  category={category}
                  installments={installmentsByCategory[category.value] || []}
                  onRefresh={loadInstallments}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ViewExpenses;
