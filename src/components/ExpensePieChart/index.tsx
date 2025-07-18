// Exemplo adaptado para ExpensePieChart
"use client";

import React from "react";
import { useExpensesStore } from "@/stores/expenseStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LoadingSpinner } from "@/components";
import { useTranslations } from "next-intl";

const COLORS = [
  "#98B484",
  "#809671",
  "#5c6092",
  "#593a2d",
  "#8f6f65",
  "#D65DB1",
  "#FF6F91",
  "#FF9671",
];

const ExpensePieChart: React.FC = () => {
  const { categories, installmentsByCategory, loading } = useExpensesStore();
  const t = useTranslations("Chart");

  const data = categories
    .map((category) => {
      const total = (installmentsByCategory[category.value] || []).reduce(
        (sum, inst) => sum + inst.amount,
        0,
      );
      return { name: category.label, value: total };
    })
    .filter((item) => item.value > 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return <div>{t("noExpensesFound")}</div>;
  }

  return (
    // Container responsivo: largura total e altura definida de forma flexível
    <div className="w-full h-64 rounded-lg p-3 mb-4">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            fill="#8884d8"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
