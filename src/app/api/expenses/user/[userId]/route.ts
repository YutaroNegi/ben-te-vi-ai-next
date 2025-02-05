import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from "next-intl";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const t = useTranslations("Api");
  try {
    const { userId } = params;

    const date12MonthsAgo = new Date();
    date12MonthsAgo.setFullYear(date12MonthsAgo.getFullYear() - 1);
    const isoDate = date12MonthsAgo.toISOString();

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', isoDate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: t('errorFetchingExpenses') },
      { status: 500 }
    );
  }
}