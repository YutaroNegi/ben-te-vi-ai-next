import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const { searchParams } = new URL(request.url);

    const userId = pathname.split("/").pop();
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }

    const date12MonthsAgo = new Date();
    date12MonthsAgo.setFullYear(date12MonthsAgo.getFullYear() - 1);
    const isoDate = date12MonthsAgo.toISOString();

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .gte("created_at", isoDate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
