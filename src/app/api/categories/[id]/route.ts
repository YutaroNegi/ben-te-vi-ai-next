import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      const msg = "Category name is required";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ name, description })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch  {
    const msg = "Failed to update category";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const msg = "Category deleted";
    return NextResponse.json({ message: msg }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error deleting category." },
      { status: 500 }
    );
  }
}
