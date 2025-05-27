import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      userId,
      pluggyItemId,
      connectorId,
      connectorName,
      status,
      executionStatus,
      lastSync,
      nextSync,
      consentExpiresAt,
      errorCode,
    } = data;

    if (!userId || !pluggyItemId) {
      return NextResponse.json(
        { error: 'Campos "userId" e "pluggyItemId" são obrigatórios.' },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("pluggy_items").upsert(
      {
        user_id: userId,
        pluggy_item_id: pluggyItemId,
        connector_id: connectorId,
        connector_name: connectorName,
        status,
        execution_status: executionStatus,
        last_sync: lastSync,
        next_sync: nextSync,
        consent_expires_at: consentExpiresAt,
        error_code: errorCode,
      },
      { onConflict: "pluggy_item_id" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Erro interno" },
      { status: 500 },
    );
  }
}
