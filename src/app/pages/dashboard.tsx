"use client";

import React from "react";
import {
  Header,
  ExpenseForm,
  ViewExpenses,
  ExpensePieChart,
  ExpensesBarChart
} from "@/components";

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row justify-center mt-5 space-y-5 md:space-y-0 md:space-x-5">
        <div className="w-full md:w-1/3 p-2">
          <ExpensesBarChart />
        </div>
        <div className="w-full md:w-1/3 p-2">
          <ExpenseForm />
        </div>
        <div className="w-full md:w-1/3 p-2">
          <ExpensePieChart />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <ViewExpenses />
      </div>
    </div>
  );
}