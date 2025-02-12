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
    return <div>Nenhuma despesa encontrada para o mês selecionado.</div>;
  }

  return (
    // Container responsivo: largura total e altura definida de forma flexível
    <div className="w-full h-64 border-2 border-chocolate-800 rounded-lg p-3">
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
            label
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
