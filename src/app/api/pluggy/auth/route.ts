import { NextResponse } from "next/server";
import { PluggyClient } from "pluggy-sdk";

export const runtime = "nodejs";

const pluggyClient = (() => {
  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Variáveis de ambiente PLUGGY_CLIENT_ID e/ou PLUGGY_CLIENT_SECRET não configuradas.",
    );
  }

  return new PluggyClient({ clientId, clientSecret });
})();

export async function POST() {
  try {
    const { accessToken: connectToken } =
      await pluggyClient.createConnectToken();

    return NextResponse.json(
      { connectToken },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Erro ao gerar connectToken do Pluggy:", err);
    return NextResponse.json(
      { error: "Erro interno ao gerar token" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Método não permitido" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
