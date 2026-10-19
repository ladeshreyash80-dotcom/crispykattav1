'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const CATEGORIES = ['Snacks','Fries','Rolls & Wraps','Momos','Sandwich','Khichdi & Patties','Burgers','Pizza','Mocktails & Tea','Shakes & Desserts'];

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-display text-xl font-bold text-brand">Crispy Katta</div>
          <Link href="/cart" className="relative text-2xl">🛒
            {count > 0 && <span className="absolute -top-1 -right-2 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative text-white">
        <img src="/images/stall/shopfront.jpg" alt="Crispy Katta shopfront" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-none tracking-tight">Crispy. Spicy.<br/>कडक swad.</h1>
          <p className="mt-3 text-stone-200 max-w-md">Fresh campus favourites, made hot and served fast. Order from your phone and pick up or get it delivered.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/menu" className="px-5 py-3 bg-brand text-white rounded-full font-semibold text-sm">Order now</Link>
            <Link href="/track" className="px-5 py-3 border border-white/40 rounded-full text-sm">Track order</Link>
          </div>
        </div>
      </section>

      {/* Stall photo */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          <img src="/images/stall/aerial.png" alt="Crispy Katta stall aerial view" className="w-full h-48 object-cover rounded-2xl shadow-card" />
          <img src="/images/stall/menu-board.jpg" alt="Crispy Katta menu board" className="w-full h-48 object-cover rounded-2xl shadow-card" />
        </div>
      </section>

      {/* Trust info */}
      <section className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-white rounded-xl p-3 shadow-card">⏱️ Quick pickup</div>
        <div className="bg-white rounded-xl p-3 shadow-card">💳 Pay at counter</div>
        <div className="bg-white rounded-xl p-3 shadow-card">📱 WhatsApp order</div>
        <div className="bg-white rounded-xl p-3 shadow-card">🔥 Fresh & hot</div>
      </section>

      {/* Featured strip */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.slice(0, 5).map(i => (
            <div key={i.id} className="min-w-[140px] bg-white rounded-2xl shadow-card overflow-hidden">
              <img src={i.image_url} alt={i.name} className="w-full h-24 object-cover" />
              <div className="p-2 text-xs font-semibold">{i.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular items */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="font-display text-2xl font-bold mb-4">Popular right now</h2>
        {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-48 bg-white rounded-2xl animate-pulse"/>)}</div>}
        {error && <p className="text-red-600">Failed to load menu: {error}</p>}
        {!loading && !error && popular.length === 0 && <p className="text-stone-500">No popular items.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popular.map(i => (
            <div key={i.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <img src={i.image_url} alt={i.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-sm">{i.name}</div>
                <div className="text-xs text-stone-500 line-clamp-1">{i.description}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-brand">₹{i.price}</span>
                  <button onClick={() => add(i)} className="px-3 py-1.5 bg-brand text-white text-xs rounded-lg active:scale-95">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="font-display text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(c => (
            <Link key={c} href={`/menu?cat=${encodeURIComponent(c)}`} className="bg-white rounded-2xl shadow-card p-4 text-center font-semibold text-sm hover:shadow-md">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* How ordering works */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="font-display text-2xl font-bold mb-4">How ordering works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-card">1. Browse the menu and add items to your cart.</div>
          <div className="bg-white rounded-2xl p-4 shadow-card">2. Enter your details and confirm the order.</div>
          <div className="bg-white rounded-2xl p-4 shadow-card">3. Track your order and collect when ready.</div>
        </div>
      </section>
    </div>
  );
}
