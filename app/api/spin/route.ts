import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const PRIZES = ['₹5 off', '₹10 off', 'Free add-on', 'Bonus 20 coins', 'Better luck next time'];

export async function POST() {
  const idx = Math.floor(Math.random() * PRIZES.length);
  return NextResponse.json({ prize: PRIZES[idx], index: idx });
}
