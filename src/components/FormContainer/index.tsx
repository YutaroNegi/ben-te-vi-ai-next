import React, { useState, useEffect } from "react";
import { ExpenseForm, Tabs } from "@/components";
import { useExpensesStore } from "@/stores/expenseStore";
import { useTranslations } from "next-intl";

export default function FormContainer() {
  const t = useTranslations("ExpenseForm");
  const [activeTab, setActiveTab] = useState(0);
  const { selectedDate, setSelectedType } = useExpensesStore();
  const selectedMonth = selectedDate
    .toLocaleString("default", {
      month: "long",
    })
    .toUpperCase();

  const tabs = [t("expense"), t("income")];

  useEffect(() => {
    setSelectedType(activeTab === 0 ? "expense" : "income");
  }, [activeTab, setSelectedType]);

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 0 && (
        <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col shadow-xl">
          <h3 className="text-chocolate-950 font-bold">{selectedMonth}</h3>
          <ExpenseForm type="expense" />
        </div>
      )}
      {activeTab === 1 && (
        <div className="border-2 border-chocolate-800 rounded-lg shadow p-4 h-[360px] flex items-center justify-center flex-col shadow-xl">
          <h3 className="text-chocolate-950 font-bold">{selectedMonth}</h3>
          <ExpenseForm type="income" />
        </div>
      )}
    </>
  );
}
