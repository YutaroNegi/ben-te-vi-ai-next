"use client";

import React, { useState } from "react";
import { InputFile, Modal, ExpenseForm, CustomToast } from "@/components";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import TransactionsTable from "@/components/TransactionsTable";
import { Transaction, InitialExpenseValues } from "@/types";
import { useTranslations } from "next-intl";

export default function SyncCSV() {
  const t = useTranslations("UploadCSV");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [initialValue, setInitialValue] = useState<InitialExpenseValues>({
    type: "expense",
    name: "",
    description: "",
    created_at: new Date().toISOString(),
    amount: 0,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: Transaction[] = (results.data as any[]).map((row) => ({
          id: uuidv4(),
          description:
            row.description ?? row.Description ?? row.title ?? row.Title ?? "",
          category: row.category ?? "",
          amount: Number(
            row.amount ?? row.Amount ?? row.valor ?? row.Valor ?? 0,
          ),
          imported: false,
          date: row.date ?? row.Date ?? "",
          pluggy_installments_reference: undefined,
          installmentNumber: row.installmentNumber,
          creditCardMetadata: undefined,
        }));

        setTransactions(parsed);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <InputFile
        className="w-full max-w-md mt-8"
        id="csv-upload"
        label="CSV"
        accept=".csv"
        placeholder={t("selectYourCsv")}
        onChange={handleFileChange}
      />

      {transactions.length > 0 && (
        <div className="mt-8 w-full flex justify-center">
          <TransactionsTable
            transactions={transactions}
            setShowModal={setShowModal}
            setInitialValue={setInitialValue}
          />
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ExpenseForm initialValue={initialValue} type="expense" />
      </Modal>
      <CustomToast />
    </div>
  );
}
