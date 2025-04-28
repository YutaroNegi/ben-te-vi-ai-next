"use client";

import React from "react";
import {
  Header,
  ViewExpenses,
  ExpensePieChart,
  ExpensesBarChart,
  FormContainer,
} from "@/components";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row justify-center mt-2 space-y-5 md:space-y-0 md:space-x-5">
        <div className="w-full md:w-1/3 p-2 mt-[2.5em]">
          <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col justify-between shadow-xl">
            <h3 className="text-chocolate-950 font-bold">
              {t("barChart").toUpperCase()}
            </h3>
            <ExpensesBarChart />
          </div>
        </div>

        <div className="w-full md:w-1/3 p-2">
          <FormContainer />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <div className="mt-[2.5em] border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col justify-between shadow-xl">
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
