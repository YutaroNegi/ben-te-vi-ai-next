"use client";

import dynamic from "next/dynamic";
// carrega só no browser; no servidor nem tenta resolver o módulo
const PluggyConnect = dynamic(
  () => import("react-pluggy-connect").then((m) => m.PluggyConnect),
  { ssr: false },
);

import React, { useCallback, useEffect, useState } from "react";
import { ItemData } from "@/types/pluggy";
import { useAuthStore } from "@/stores/authStore";
import {
  LoadingSpinner,
  TransactionsTable,
  MonthSelector,
  Modal,
  ExpenseForm,
  CustomToast,
} from "@/components";
import { Transaction, InitialExpenseValues } from "@/types";

interface PluggyProps {
  readonly show: boolean;
}

export default function Pluggy({ show }: PluggyProps) {
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.user?.id);
  const [transactionsByItem, setTransactionsByItem] = useState<
    Record<string, Transaction[]>
  >({});
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [showModal, setShowModal] = useState(false);
  const [initialValue, setInitialValue] = useState<InitialExpenseValues>({
    type: "expense",
    name: "",
    description: "",
    created_at: new Date().toISOString(),
    amount: 0,
  });

  const fetchConnectToken = useCallback(async () => {
    try {
      const res = await fetch("/api/pluggy/auth", { method: "POST" });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data: { connectToken: string } = await res.json();
      setConnectToken(data.connectToken);
    } catch (err) {
      console.error("Failed to fetch Pluggy connect token:", err);
      setError("Não foi possível iniciar a conexão financeira.");
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/pluggy/items/user/${userId}`);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      console.error("Failed to fetch Pluggy items:", err);
      setError("Não foi possível buscar os itens do Pluggy.");
      return [];
    }
  }, [userId]);

  const fetchTransactions = useCallback(
    async (pluggyItemId: string, date: Date) => {
      try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-based
        const res = await fetch(
          `/api/pluggy/transactions/item/${pluggyItemId}?year=${year}&month=${month}`,
        );

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        return data.transactions;
      } catch (err) {
        console.error("Failed to fetch Pluggy items:", err);
        setError("Não foi possível buscar os itens do Pluggy.");
        return [];
      }
    },
    [],
  );

  const fetchPluggy = useCallback(async () => {
    if (!userId) {
      console.warn("User ID is not available, skipping item fetch.");
      return;
    }
    const pluggyItems = await fetchItems();
    if (pluggyItems.length === 0) {
      console.warn("No Pluggy items found for the user.");
      return;
    }
    const transactionsData: Record<string, Transaction[]> = {};

    for (const item of pluggyItems) {
      const txs = await fetchTransactions(item.pluggy_item_id, selectedDate);

      transactionsData[item.pluggy_item_id] = txs.map((tx: Transaction) => ({
        id: tx.id,
        description: tx.description,
        category: tx.category,
        amount: tx.amount,
        imported: tx.imported,
        date: tx.date,
      }));
    }

    setTransactionsByItem(transactionsData);
  }, [userId, fetchItems, fetchTransactions, selectedDate]);

  useEffect(() => {
    fetchConnectToken();
  }, [fetchConnectToken]);

  useEffect(() => {
    if (userId) {
      fetchPluggy();
    } else {
      console.warn("User ID is not available, skipping item fetch.");
    }
  }, [userId, fetchPluggy]);

  const onSuccess = async ({ item }: { item: ItemData }) => {
    try {
      await fetch("api/pluggy/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          pluggyItemId: item.id,
          connectorId: item.connector.id,
          connectorName: item.connector.name,
          status: item.status,
          executionStatus: item.executionStatus,
          lastSync: item.lastUpdatedAt,
          nextSync: item.nextAutoSyncAt,
          consentExpiresAt: item.consentExpiresAt,
        }),
      });
    } catch (err) {
      console.error("Falha ao salvar Item do Pluggy:", err);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!connectToken) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {show && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={false}
          /* limita a listagem apenas ao conector Nubank */
          connectorIds={[612]} // ID do conector Nubank no Pluggy
          selectedConnectorId={612} // já abre direto no Nubank
          onSuccess={onSuccess}
        />
      )}
      <div>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} />
        {Object.entries(transactionsByItem).map(([itemId, txs]) => (
          <div key={itemId} className="mb-4">
            <TransactionsTable
              transactions={txs}
              setInitialValue={setInitialValue}
              setShowModal={setShowModal}
            />
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ExpenseForm
          initialValue={initialValue}
          type="expense"
          onSubmit={fetchPluggy}
        />
      </Modal>
      <CustomToast />
    </div>
  );
}
