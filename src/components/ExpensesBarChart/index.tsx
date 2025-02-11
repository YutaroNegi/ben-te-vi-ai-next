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

  // Enquanto os dados estiverem sendo carregados, mostra uma mensagem de espera
  if (loading) {
    return <LoadingSpinner />;
  }

  // Obtém o ano e mês da data selecionada
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth(); // Lembrando que 0 representa janeiro

  // Calcula a quantidade de dias do mês selecionado
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Inicializa um array com um objeto para cada dia do mês, com valor inicial 0
  const data = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: 0,
  }));

  // Percorre todas as categorias e seus installments para agregar os valores diários
  categories.forEach((category) => {
    const installments = installmentsByCategory[category.value] || [];
    installments.forEach((inst) => {
      const instDate = new Date(inst.due_date);
      // Confirma se o installment pertence ao mês e ano selecionados
      if (instDate.getFullYear() === year && instDate.getMonth() === month) {
        const day = instDate.getDate();
        data[day - 1].amount += inst.amount;
      }
    });
  });

  return (
    <div className="w-full h-80 text-xs">
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
