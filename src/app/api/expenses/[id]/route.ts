import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(request: NextRequest) {
  try {
    // 1. Parse the "id" from the URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // last segment, e.g. "123"

    if (!id) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { category_id, name, description, amount } = body;

    if (!category_id || !name || amount === undefined) {
      return NextResponse.json(
        { error: "Some required fields are missing" },
        { status: 400 },
      );
    }

    // 2. Update the "expenses" row
    const { data, error } = await supabase
      .from("expenses")
      .update({ category_id, name, description, amount })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error updating expense" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Parse the "id" from the URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }

    // 2. Delete the "expenses" row
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error deleting expense" },
      { status: 500 },
    );
  }
}
