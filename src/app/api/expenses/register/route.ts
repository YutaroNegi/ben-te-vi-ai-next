import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function addMonths(yyyyMmDd: string, months: number): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number); // m = 1..12
  const startMonthIdx = m - 1 + months; // 0..∞
  const year = y + Math.floor(startMonthIdx / 12);
  const monthIdx = ((startMonthIdx % 12) + 12) % 12; // 0..11

  const lastDay = new Date(Date.UTC(year, monthIdx + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDay);

  return new Date(Date.UTC(year, monthIdx, day)).toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      category_id,
      name,
      description,
      amount,
      date,
      installments,
      type,
      pluggy_transaction_id,
      pluggy_installments_reference,
    } = body;

    if (!user_id || !category_id || !name || amount === undefined || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: expense, error: expenseError } = await supabase
      .from("expenses")
      .insert([
        {
          user_id,
          category_id,
          name,
          description,
          amount,
          type,
          pluggy_installments_reference,
        },
      ])
      .select("*")
      .single();

    if (expenseError) {
      return NextResponse.json(
        { error: expenseError.message },
        { status: 500 },
      );
    }

    const numInstallments = parseInt(installments, 10);
    const dateStr = String(date); // esperado "YYYY-MM-DD"

    if (numInstallments > 1) {
      const expenseAmount = parseFloat(amount);
      const installmentAmount = Number(
        (expenseAmount / numInstallments).toFixed(2),
      );

      const installmentsData = Array.from(
        { length: numInstallments },
        (_, index) => {
          const dueDateStr = addMonths(dateStr, index);
          return {
            expense_id: expense.id,
            installment_number: index + 1,
            due_date: dueDateStr,
            amount: installmentAmount,
            paid: false,
            pluggy_transaction_id: index === 0 ? pluggy_transaction_id : null,
          };
        },
      );

      const { error: installmentsError } = await supabase
        .from("installments")
        .insert(installmentsData);

      if (installmentsError) {
        return NextResponse.json(
          { error: installmentsError.message },
          { status: 500 },
        );
      }
    } else {
      const dueDateStr = addMonths(dateStr, 0);
      const installmentRecord = {
        expense_id: expense.id,
        installment_number: 1,
        due_date: dueDateStr,
        amount,
        paid: false,
        pluggy_transaction_id: pluggy_transaction_id ?? null,
      };
      await supabase.from("installments").insert([installmentRecord]);
    }

    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error saving expense" },
      { status: 500 },
    );
  }
}
