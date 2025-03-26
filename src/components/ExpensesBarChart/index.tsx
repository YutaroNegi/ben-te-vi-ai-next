"use client";

import React from "react";
import { useExpensesStore } from "@/stores/expenseStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { LoadingSpinner } from "@/components";

const ExpensesBarChart: React.FC = () => {
  const { selectedDate, installmentsByCategory, categories, loading } =
    useExpensesStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const data = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: 0,
  }));

  categories.forEach((category) => {
    const installments = installmentsByCategory[category.value] || [];
    installments.forEach((inst) => {
      const instDate = new Date(inst.due_date);
      if (instDate.getFullYear() === year && instDate.getMonth() === month) {
        const day = instDate.getDate();
        data[day - 1].amount += inst.amount;
      }
    });
  });

  return (
    <div className="w-full h-64 text-xs rounded-lg p-5">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            label={{ value: "Dia", position: "insideBottom", dy: 10 }}
          />
          <YAxis
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
            label={{
              value: "Valor",
              angle: -90,
              position: "insideLeft",
              dx: -10,
            }}
          />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Despesas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesBarChart;
