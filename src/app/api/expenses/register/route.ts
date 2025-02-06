import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, category_id, name, description, amount, date, installments } = body;

    if (!user_id || !category_id || !name || amount === undefined || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert([{ user_id, category_id, name, description, amount }])
      .select('*')
      .single();

    if (expenseError) {
      return NextResponse.json({ error: expenseError.message }, { status: 500 });
    }

    const numInstallments = parseInt(installments, 10);

    if (numInstallments > 1) {
      const expenseAmount = parseFloat(amount);
      const installmentAmount = parseFloat((expenseAmount / numInstallments).toFixed(2));
      const startDate = new Date(date);

      const installmentsData = Array.from({ length: numInstallments }, (_, index) => {
        const dueDate = addMonths(startDate, index);
        return {
          expense_id: expense.id,
          installment_number: index + 1,
          due_date: dueDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
          amount: installmentAmount,
          paid: false
        };
      });

      const { error: installmentsError } = await supabase
        .from('installments')
        .insert(installmentsData);

      if (installmentsError) {
        return NextResponse.json({ error: installmentsError.message }, { status: 500 });
      }
    } else {
      const startDate = new Date(date);
      const installmentRecord = {
        expense_id: expense.id,
        installment_number: 1,
        due_date: startDate.toISOString().split('T')[0],
        amount: amount,
        paid: false
      };

      const { error: installmentError } = await supabase
        .from('installments')
        .insert([installmentRecord]);

      if (installmentError) {
        return NextResponse.json({ error: installmentError.message }, { status: 500 });
      }
    }

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error saving expense" },
      { status: 500 }
    );
  }
}