import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    // Parse the userId from the URL path
    const { pathname } = new URL(request.url);
    // e.g. "/api/categories/user/abc123"
    const userId = pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error fetching categories." },
      { status: 500 },
    );
  }
}
