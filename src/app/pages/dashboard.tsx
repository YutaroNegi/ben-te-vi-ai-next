"use client";

import React from "react";
import { Header, ExpenseForm, ViewExpenses } from "@/components";

export default function DashbparPage() {
  return (
    <div>
      <Header />
      <div className="flex justify-center mt-10">
        <ExpenseForm />
      </div>
      <div className="flex justify-center mt-10">
        <ViewExpenses />
      </div>
    </div>
  );
}
