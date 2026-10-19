import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { MOCK_MENU } from '@/lib/mockMenu';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ items: MOCK_MENU, demo: true });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('menu_items').select('*, categories(name)').eq('available', true);
    if (error) throw error;
    const items = (data ?? []).length ? data : MOCK_MENU;
    return NextResponse.json({ items, demo: (data ?? []).length === 0 });
  } catch (e: any) {
    return NextResponse.json({ items: MOCK_MENU, demo: true, error: e?.message ?? 'Unknown error' });
  }
}
