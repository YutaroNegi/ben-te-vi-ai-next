import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { useTranslations } from "next-intl";


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = useTranslations("Api");
  try {
    const id = params.id;
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: t("categoryNameIsRequired") },
        { status: 400 }
      );
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
  } catch (err) {
    return NextResponse.json(
      { error: t("errorUpdatingCategory") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = useTranslations("Api");
  try {
    const id = params.id;

    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: t("categoryDeleted") },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error deleting category." },
      { status: 500 }
    );
  }
}
