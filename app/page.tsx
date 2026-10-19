'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const CATEGORIES = [
  { name: 'Snacks', desc: 'Crispy bites' },
  { name: 'Fries', desc: 'Golden & hot' },
  { name: 'Rolls & Wraps', desc: 'Stuffed parathas' },
  { name: 'Momos', desc: 'Steamed & fried' },
  { name: 'Sandwich', desc: 'Toasted & grilled' },
  { name: 'Khichdi & Patties', desc: 'Comfort food' },
  { name: 'Burgers', desc: 'Juicy stacks' },
  { name: 'Pizza', desc: 'Cheesy slices' },
  { name: 'Mocktails & Tea', desc: 'Cool & hot sips' },
  { name: 'Shakes & Desserts', desc: 'Sweet endings' },
];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, count } = useCart();

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/menu', { signal: ctrl.signal })
      .then(async r => {
        const text = await r.text();
        let d: any = {};
        try { d = text ? JSON.parse(text) : {}; } catch { throw new Error('Invalid JSON'); }
        if (!r.ok) throw new Error(d?.error || `HTTP ${r.status}`);
        setItems(Array.isArray(d.items) ? d.items : []);
      })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const popular = items.filter(i => i.is_popular).slice(0, 6);

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-display text-lg font-bold text-charcoal leading-none">CRISPY कढई</div>
              <div className="text-[10px] tracking-widest text-stone-500">CAFÉ AND SNACKS</div>
            </div>
          </div>
          <Link href="/cart" className="bg-charcoal text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            🛒 Cart
            {count > 0 && <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative text-white">
        <img src="/images/stall/shopfront.jpg" alt="Crispy Katta shopfront" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="inline-block bg-brand/20 border border-brand/40 text-brand text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">Campus Gate No. 2 • Café and Snacks</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-none tracking-tight">Crispy. Spicy. कढई swad.</h1>
          <p className="mt-4 text-stone-200 max-w-md">चव कढई... निखेला आवडेल तही... samosas, momos, rolls, burgers and filter coffee, fried to order and flown to your hostel.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/menu" className="px-6 py-3 bg-brand text-white rounded-full font-semibold text-sm">Order now →</Link>
            <Link href="/track" className="px-6 py-3 border border-white/40 rounded-full text-sm backdrop-blur-sm bg-white/10">Track order</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs">42+ items</span>
            <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs">from ₹12</span>
            <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs">~20 min prep</span>
            <span className="bg-red-600/80 px-3 py-1 rounded-full text-xs">Closed</span>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-amber-400 overflow-hidden py-2">
        <div className="whitespace-nowrap animate-marquee text-sm font-semibold text-charcoal">
          🔥 KADHI SAMOSA ₹35  ⚡ PERI PERI VADA ₹25  🔥 PANEER MOMOS ₹80  ⚡ SPECIAL KULHAD CHAI ₹20  🔥 KADHI SAMOSA ₹35  ⚡ PERI PERI VADA ₹25  🔥 PANEER MOMOS ₹80  ⚡ SPECIAL KULHAD CHAI ₹20
        </div>
      </div>

      {/* Trust / featured strip */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">Student Favourites</div>
        <h2 className="font-display text-2xl font-bold mb-4">Featured food</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.slice(0, 5).map(i => (
            <div key={i.id} className="min-w-[160px] bg-white rounded-3xl shadow-card overflow-hidden">
              <img src={i.image_url} alt={i.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-sm">{i.name}</div>
                <div className="text-brand font-bold text-sm mt-1">₹{i.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular items */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">Cravings, Sorted</div>
        <h2 className="font-display text-2xl font-bold mb-4">Popular right now</h2>
        {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-48 bg-white rounded-3xl animate-pulse"/>)}</div>}
        {error && <p className="text-red-600">Failed to load menu: {error}</p>}
        {!loading && !error && popular.length === 0 && <p className="text-stone-500">No popular items.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popular.map(i => (
            <div key={i.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="relative">
                <img src={i.image_url} alt={i.name} className="w-full h-36 object-cover" />
                <span className="absolute top-2 left-2 bg-brand text-white text-xs px-2 py-0.5 rounded-full">🔥 Popular</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 text-xs">🟢</span>
                  <h3 className="font-semibold text-sm">{i.name}</h3>
                </div>
                <p className="text-xs text-stone-500 line-clamp-1 mt-1">{i.description}</p>
                <div className="text-xs text-stone-400 mt-1">⏱️ 10 min</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-brand">₹{i.price}</span>
                  <button onClick={() => add(i)} className="px-3 py-1.5 bg-brand text-white text-xs rounded-lg active:scale-95">+ Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">Zero Fuss</div>
        <h2 className="font-display text-2xl font-bold mb-4">Cravings, sorted</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(c => (
            <Link key={c.name} href={`/menu?cat=${encodeURIComponent(c.name)}`} className="relative rounded-3xl overflow-hidden shadow-card h-28 block">
              <img src="/images/stall/shopfront.jpg" alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <div className="text-white font-bold text-sm">{c.name}</div>
                <div className="text-white/70 text-xs">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How ordering works */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">How it works</div>
        <h2 className="font-display text-2xl font-bold mb-4">Order in 3 steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-card">1. Browse the menu and add items to your cart.</div>
          <div className="bg-white rounded-3xl p-4 shadow-card">2. Enter your details and confirm the order.</div>
          <div className="bg-white rounded-3xl p-4 shadow-card">3. Track your order and collect when ready.</div>
        </div>
      </section>
    </div>
  );
}
