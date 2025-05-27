import React, { useCallback, useEffect, useState } from "react";
import { PluggyConnect } from "react-pluggy-connect";
import { ItemData } from "@/types/pluggy";
import { useAuthStore } from "@/stores/authStore";

interface PluggyProps {
  readonly show: boolean;
}

export default function Pluggy({ show }: PluggyProps) {
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.user?.id);

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

  useEffect(() => {
    fetchConnectToken();
  }, [fetchConnectToken]);

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
    return <p>Carregando conexão segura…</p>;
  }

  return (
    <div>
      {show && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={false}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
