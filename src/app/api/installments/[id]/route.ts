import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Ajuste se necessário

export async function PUT(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const installmentId = pathname.split("/").pop(); // last segment, e.g. "123"

    if (!installmentId) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }

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

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const installmentId = pathname.split("/").pop(); // last segment, e.g. "123"

    if (!installmentId) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }
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
