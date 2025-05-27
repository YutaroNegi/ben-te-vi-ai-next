import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { pluggyClient } from "@/lib/pluggy";
import { Account, Transaction } from "pluggy-sdk";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const userId = pathname.split("/").pop(); // last segment

    const { data: itemRow, error } = await supabase
      .from("pluggy_items")
      .select("pluggy_item_id")
      .eq("user_id", userId)
      .single();

    if (error || !itemRow) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    const { results: accounts } = await pluggyClient.fetchAccounts(
      itemRow.pluggy_item_id,
    );

    const creditAccounts = accounts.filter(
      (acc: Account) => acc.subtype === "CREDIT_CARD",
    );

    if (creditAccounts.length === 0) {
      return NextResponse.json({ transactions: [] });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const allTx: Transaction[] = [];
    for (const acc of creditAccounts) {
      const { results: tx } = await pluggyClient.fetchTransactions(acc.id);
      allTx.push(
        ...tx.filter((t: Transaction) => {
          const txDate = new Date(t.date);
          return txDate >= monthStart && txDate <= now;
        }),
      );
    }

    return NextResponse.json({ transactions: allTx });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
