"use client";

import React from "react";
import {
  Header,
  ExpenseForm,
  ViewExpenses,
  ExpensePieChart,
  ExpensesBarChart,
} from "@/components";

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row justify-center mt-2 space-y-5 md:space-y-0 md:space-x-5">
        <div className="w-full md:w-1/3 p-2">
          <div className=" border-2 border-chocolate-800 rounded-lg shadow p-4 h-[400px] flex items-center justify-center">
            <ExpensesBarChart />
          </div>
        </div>

        <div className="w-full md:w-1/3 p-2">
          <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[400px] flex items-center justify-center">
            <ExpenseForm />
          </div>
        </div>

        <div className="w-full md:w-1/3 p-2">
          <div className=" border-2 border-chocolate-800 rounded-lg shadow p-4 h-[400px] flex items-center justify-center">
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