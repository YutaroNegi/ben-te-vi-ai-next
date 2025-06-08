/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { pluggyClient } from "@/lib/pluggy";
import { Account, Transaction } from "pluggy-sdk";
import { supabase } from "@/lib/supabaseClient";

import crypto from "crypto";

function generateInstallmentsReference(
  cardNumber: string,
  purchaseDate: string,
  totalInstallments: number,
  description: string,
): string {
  const normalizedDesc = description
    .replace(/\s+\d+\/\d+\s*$/, "")
    .toLowerCase()
    .trim();
  return crypto
    .createHash("sha256")
    .update(
      `${cardNumber}|${purchaseDate}|${totalInstallments}|${normalizedDesc}`,
    )
    .digest("hex");
}

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const pluggyItemId = pathname.split("/").pop();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!pluggyItemId) {
      return NextResponse.json(
        { error: "Missing pluggyItemId" },
        { status: 400 },
      );
    }

    try {
      await pluggyClient.updateItem(pluggyItemId);
    } catch (err) {
      console.warn("Ignoring Error updating item:", err);
    }

    const { results: accounts } =
      await pluggyClient.fetchAccounts(pluggyItemId);

    const creditAccounts = accounts.filter(
      (acc: Account) => acc.subtype === "CREDIT_CARD",
    );

    if (creditAccounts.length === 0) {
      return NextResponse.json({ transactions: [] });
    }

    const today = new Date();
    const targetYear = year ? Number(year) : today.getFullYear();
    const targetMonth = month ? Number(month) - 1 : today.getMonth();

    const fromDate = new Date(targetYear, targetMonth, 1);
    const toDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999); // último dia às 23:59:59

    const allTx: Transaction[] = [];
    for (const acc of creditAccounts) {
      const { results: tx } = await pluggyClient.fetchTransactions(acc.id, {
        pageSize: 500,
        from: fromDate.toISOString().slice(0, 10), // YYYY-MM-DD
        to: toDate.toISOString().slice(0, 10), // YYYY-MM-DD
      });
      allTx.push(
        ...tx.filter((t: Transaction) => {
          const txDate = new Date(t.date);
          return txDate >= fromDate && txDate <= toDate;
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

    let importedRefsSet: Set<string> = new Set();

    for (const tx of allTx) {
      const meta = tx.creditCardMetadata as any;

      if (meta?.totalInstallments && meta.totalInstallments > 1) {
        const pluggy_installments_reference = generateInstallmentsReference(
          meta.cardNumber ?? "",
          meta.purchaseDate,
          meta.totalInstallments,
          tx.description,
        );
        (tx as any).pluggy_installments_reference =
          pluggy_installments_reference;
      }
    }

    const references = allTx
      .map((t) => (t as any).pluggy_installments_reference)
      .filter(Boolean);
    if (references.length) {
      const { data: refRows, error: refErr } = await supabase
        .from("expenses")
        .select("pluggy_installments_reference")
        .in("pluggy_installments_reference", references);

      if (refErr) {
        return NextResponse.json({ error: refErr.message }, { status: 500 });
      }

      importedRefsSet = new Set(
        (refRows ?? []).map((row) => row.pluggy_installments_reference),
      );
    }

    const transactions = allTx.map((tx) => {
      const ref = (tx as any).pluggy_installments_reference;
      const imported =
        importedSet.has(tx.id) || (ref ? importedRefsSet.has(ref) : false);

      return {
        ...tx,
        imported,
      };
    });

    return NextResponse.json({ transactions });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
