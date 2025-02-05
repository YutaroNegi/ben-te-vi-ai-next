import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';

export async function POST(request: NextRequest) {
  const t = useTranslations("Api");
  try {
    const body = await request.json();
    const { user_id, name, description } = body;

    if (!user_id || !name) {
      
      return NextResponse.json({ error: t('userIdNameRequired')}, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id, name, description }])
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: t('errorSavingExpense') }, { status: 500 });
  }
}