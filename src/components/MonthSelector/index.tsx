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
  const inputRef = React.useRef<HTMLInputElement>(null);

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

      <button
        type="button"
        onClick={() => {
          if (!inputRef.current) return;
          if (typeof inputRef.current.showPicker === "function") {
            inputRef.current.showPicker();
            inputRef.current.focus();
          } else {
            inputRef.current.click();
          }
        }}
        className="relative px-4 py-2 bg-bentenavi-dark text-white focus:outline-none"
      >
        {selectedDate
          .toLocaleString("default", { month: "long", year: "numeric" })
          .toUpperCase()}
        <input
          ref={inputRef}
          type="month"
          value={`${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`}
          required
          onChange={(e) => {
            // If the value is cleared, keep the previous month to avoid breaking the component
            if (!e.target.value) {
              return;
            }
            const [year, month] = e.target.value.split("-");
            onChange(new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1));
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </button>

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
