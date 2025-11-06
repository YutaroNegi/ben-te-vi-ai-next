"use client";

import React, { useState } from "react";
import { InputFile, Modal, ExpenseForm, CustomToast } from "@/components";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import TransactionsTable from "@/components/TransactionsTable";
import { Transaction, InitialExpenseValues } from "@/types";
import { useTranslations } from "next-intl";
import { FaCloudUploadAlt } from "react-icons/fa";

const getField = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key] as string | number;
    }
  }
  return undefined;
};

const parseNumber = (value: string | number | undefined): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const str = String(value).trim();

  // Case 1: Brazilian format with comma as decimal separator (e.g., 1.234,56)
  if (str.includes(",")) {
    const cleaned = str.replace(/\./g, "").replace(",", ".");
    return Number(cleaned);
  }

  // Case 2: Standard format with dot as decimal separator (e.g., 168.41)
  return Number(str.replace(/,/g, ""));
};

const parseDateString = (value: string | undefined): string => {
  if (!value) return "";
  const str = String(value).trim();
  // ISO / US format YYYY‑MM‑DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{2}[-/]\d{2}/.test(str)) {
    return new Date(str).toISOString();
  }
  // Brazilian format DD/MM/YYYY
  const br = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) {
    const [, d, m, y] = br;
    return new Date(`${y}-${m}-${d}`).toISOString();
  }
  // Fallback
  return new Date(str).toISOString();
};
// -------------------------------------------------------------------------

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
            (getField(row, [
              "description",
              "Description",
              "descricao",
              "Descrição",
              "title",
              "Title",
              "titulo",
              "Titulo",
            ]) as string) ?? "",
          category:
            (getField(row, [
              "category",
              "Category",
              "categoria",
              "Categoria",
            ]) as string) ?? "",
          amount: parseNumber(
            getField(row, [
              "amount",
              "Amount",
              "valor",
              "Valor",
              "valor (r$)",
              "Valor (R$)",
            ]) as string | number | undefined,
          ),
          imported: false,
          date: parseDateString(
            getField(row, ["date", "Date", "data", "Data"]) as
              | string
              | undefined,
          ),
          pluggy_installments_reference: undefined,
          installmentNumber: getField(row, [
            "installmentNumber",
            "installment_number",
            "parcela",
            "InstallmentNumber",
          ]) as number | undefined,
          creditCardMetadata: undefined,
        }));

        setTransactions(parsed);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-matcha-dark grid place-items-center pa-5 h-[25em] rounded-lg shadow-md w-[50em] mt-10">
        <div className="grid place-items-center gap-5">
          <FaCloudUploadAlt size={100} className="text-white" />
          <div className="text-center text-white text-2xl">
            {t("selectYourCsvInfo")}
          </div>
          <InputFile
            // className="w-full max-w-md"
            id="csv-upload"
            accept=".csv"
            label={t("selectYourCsv")}
            onChange={handleFileChange}
          />
        </div>
      </div>

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
