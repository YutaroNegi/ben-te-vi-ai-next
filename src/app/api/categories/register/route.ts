import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, name, description, type } = body;

    if (!user_id || !name) {
      const msg = "Missing required fields";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ user_id, name, description, type }])
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    const msg = "Failed to register category";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
