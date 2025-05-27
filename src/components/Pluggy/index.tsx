import React, { useCallback, useEffect, useState } from "react";
import { PluggyConnect } from "react-pluggy-connect";
import { ItemData } from "@/types/pluggy";

interface PluggyProps {
  readonly show: boolean;
}

export default function Pluggy({ show }: PluggyProps) {
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const onSuccess = ({ item }: { item: ItemData }) => {
    console.log("Pluggy success:", item);
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
