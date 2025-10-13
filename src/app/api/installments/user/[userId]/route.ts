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
    const typeParam = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const searchTerm = searchParams.get("searchTerm");

    let query = supabase
      .from("installments_extended")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });

    if (typeParam === "income" || typeParam === "expense") {
      query = query.eq("type", typeParam);
    }

    if (startDate) {
      query = query.gte("due_date", startDate);
    }
    if (endDate) {
      query = query.lte("due_date", endDate);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (searchTerm && searchTerm.trim()) {
      const t = searchTerm.trim();
      query = query.or(
        `expense_name.ilike.%${t}%,expense_description.ilike.%${t}%`,
      );
    }

    const { data, error } = await query;
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
