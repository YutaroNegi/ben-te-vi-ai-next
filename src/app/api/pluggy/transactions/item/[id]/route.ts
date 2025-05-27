import { NextResponse } from "next/server";
import { pluggyClient } from "@/lib/pluggy";
import { Account, Transaction } from "pluggy-sdk";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const pluggyItemId = pathname.split("/").pop();

    if (!pluggyItemId) {
      return NextResponse.json(
        { error: "Missing pluggyItemId" },
        { status: 400 },
      );
    }

    const { results: accounts } =
      await pluggyClient.fetchAccounts(pluggyItemId);

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

    const ids = allTx.map((tx) => tx.id);

    const { data: imported, error: importErr } = await supabase
      .from("installments")
      .select("pluggy_transaction_id")
      .in("pluggy_transaction_id", ids);

    if (importErr) {
      return NextResponse.json({ error: importErr.message }, { status: 500 });
    }

    const importedSet = new Set(
      (imported ?? []).map((row) => row.pluggy_transaction_id),
    );

    const transactions = allTx.map((tx) => ({
      ...tx,
      imported: importedSet.has(tx.id),
    }));

    return NextResponse.json({ transactions });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
