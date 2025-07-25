import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const userId = pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing "id" in URL path' },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing start date or end date" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("installments_extended")
      .select("*")
      .gte("due_date", startDate)
      .lt("due_date", endDate)
      .eq("user_id", userId)
      .eq("type", type);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const grouped: Record<string, unknown[]> = {};
    interface Installment {
      expense: {
        category_id: string;
      };
    }
    data.forEach((inst: Installment) => {
      const catId = inst.expense?.category_id;
      if (catId) {
        if (!grouped[catId]) {
          grouped[catId] = [];
        }
        grouped[catId].push(inst);
      }
    });

    return NextResponse.json(grouped, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro fetching installments." },
      { status: 500 },
    );
  }
}
