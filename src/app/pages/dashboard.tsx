"use client";

import React from "react";
import {
  Header,
  ExpenseForm,
  ViewExpenses,
  ExpensePieChart,
  ExpensesBarChart,
} from "@/components";
import { useTranslations } from "next-intl";
import { useExpensesStore } from "@/stores/expenseStore";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { selectedDate } = useExpensesStore();
  const selectedMonth = selectedDate
    .toLocaleString("default", {
      month: "long",
    })
    .toUpperCase();

  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row justify-center mt-2 space-y-5 md:space-y-0 md:space-x-5">
        <div className="w-full md:w-1/3 p-2">
          <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col justify-between shadow-xl">
            <h3 className="text-chocolate-950 font-bold">
              {t("barChart").toUpperCase()}
            </h3>
            <ExpensesBarChart />
          </div>
        </div>

        <div className="w-full md:w-1/3 p-2">
          <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col shadow-xl">
            <h3 className="text-chocolate-950 font-bold">{selectedMonth}</h3>
            <ExpenseForm />
          </div>
        </div>

        <div className="w-full md:w-1/3 p-2">
          <div className=" border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col justify-between shadow-xl">
            <h3 className="text-chocolate-950 font-bold">
              {t("pieChart").toUpperCase()}
            </h3>
            <ExpensePieChart />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <ViewExpenses />
      </div>
    </div>
  );
}
