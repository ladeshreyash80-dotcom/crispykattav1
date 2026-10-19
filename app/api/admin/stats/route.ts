import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Server-side only; requires service role key at runtime, not build time.
  return NextResponse.json({ orders: 0, revenue: 0, popular: [] });
}
