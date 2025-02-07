import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(request: Request) {
  try {
    // Parse `id` from the URL path
    const { pathname } = new URL(request.url);
    // e.g. "/api/categories/123", so `id = "123"` if it's the last segment
    const id = pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Missing ID in path" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
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
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Missing ID in path" }, { status: 400 });
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error deleting category." }, { status: 500 });
  }
}