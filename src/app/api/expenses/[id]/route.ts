import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { category_id, name, description, amount } = body;

    if (!category_id || !name || amount === undefined) {
      return NextResponse.json(
        { error:'error'},
        { status: 400 }
      );
    }

    // Atualiza a despesa na tabela "expenses"
    const { data, error } = await supabase
      .from('expenses')
      .update({ category_id, name, description, amount })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Remove a despesa na tabela "expenses"
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'error' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'error' },
      { status: 500 }
    );
  }
}