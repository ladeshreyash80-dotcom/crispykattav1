import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const ItemSchema = z.object({ menu_item_id: z.string().uuid(), qty: z.number().int().positive() });
const OrderSchema = z.object({
  customer_name: z.string().min(1),
  phone: z.string().min(6),
  address: z.string().min(1),
  instructions: z.string().optional(),
  idempotency_key: z.string().uuid(),
  items: z.array(ItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { customer_name, phone, address, instructions, idempotency_key, items } = parsed.data;

  const supabase = createSupabaseServiceClient();

  // Idempotency check
  const { data: existing } = await supabase.from('orders').select('reference').eq('idempotency_key', idempotency_key).maybeSingle();
  if (existing) return NextResponse.json({ reference: existing.reference, duplicate: true });

  // Server-side price lookup
  const ids = items.map(i => i.menu_item_id);
  const { data: menu } = await supabase.from('menu_items').select('id,name,price,available').in('id', ids);
  const map = new Map((menu ?? []).map((m: any) => [m.id, m]));
  let subtotal = 0;
  const orderItems = items.map(i => {
    const m: any = map.get(i.menu_item_id);
    if (!m || !m.available) throw new Error('Item unavailable');
    subtotal += Number(m.price) * i.qty;
    return { menu_item_id: i.menu_item_id, name: m.name, price: m.price, qty: i.qty };
  });

  const reference = 'CK-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data: order, error } = await supabase.from('orders').insert({
    reference, customer_name, phone, address, instructions,
    status: 'pending', subtotal, discount: 0, delivery_fee: 0, total: subtotal,
    idempotency_key,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('order_items').insert(orderItems.map(oi => ({ ...oi, order_id: order.id })));
  return NextResponse.json({ reference: order.reference });
}
