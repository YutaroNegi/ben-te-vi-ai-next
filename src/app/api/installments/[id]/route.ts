import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Ajuste se necessário

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const installmentId = context.params.id;
    const data = await request.json();

    const { error } = await supabase
      .from("installments")
      .update({
        amount: data.amount,
        due_date: data.due_date,
        installment_number: data.installment_number,
        paid: data.paid,
      })
      .eq("id", installmentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const installmentId = context.params.id;

    const { error } = await supabase
      .from("installments")
      .delete()
      .eq("id", installmentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
