"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface MonthSelectorProps {
  selectedDate: Date;
  onChange: (newDate: Date) => void;
  className?: string;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedDate,
  onChange,
  className = "",
}) => {
  const handlePrev = () => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    onChange(new Date(y, m - 1, 1));
  };

  const handleNext = () => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    onChange(new Date(y, m + 1, 1));
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        onClick={handlePrev}
        className="p-3 bg-bentenavi-dark text-white rounded-l hover:bg-gray-400 transition-colors"
        aria-label="Previous month"
      >
        <FaArrowLeft />
      </button>

      <div className="px-4 py-2 bg-bentenavi-dark text-white">
        {selectedDate
          .toLocaleString("default", { month: "long", year: "numeric" })
          .toUpperCase()}
      </div>

      <button
        onClick={handleNext}
        className="p-3 bg-bentenavi-dark text-white rounded-r hover:bg-gray-400 transition-colors"
        aria-label="Next month"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default MonthSelector;
