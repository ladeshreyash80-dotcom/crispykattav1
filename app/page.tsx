'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const CATEGORIES = ['All', 'Bestsellers', 'Momos', 'Rolls', 'Snacks', 'Beverages', 'Desserts'];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const { add, count, total } = useCart();

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

  const filtered = items.filter(i => {
    const matchCat = cat === 'All' || (cat === 'Bestsellers' ? i.is_popular : i.category === cat);
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-xl font-bold text-orange-600">🥟 Crispy Katta</div>
          <div className="hidden md:block text-sm text-stone-500">Main Canteen • Block A</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search snacks..." className="flex-1 border rounded-full px-4 py-2 text-sm" />
          <Link href="/cart" className="relative px-4 py-2 bg-orange-600 text-white rounded-full text-sm">
            Cart
            {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Hot & Crispy Campus Bites Delivered Fresh 🚀</h1>
          <p className="mt-2 opacity-90">Order samosas, momos, rolls & beverages straight from your phone.</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setCat('Bestsellers')} className="px-4 py-2 bg-white text-orange-600 rounded-full text-sm font-semibold">🔥 Popular Items</button>
            <button onClick={() => setCat('Snacks')} className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">⚡ Under ₹50</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-auto flex gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${cat === c ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-stone-700 border-stone-200'}`}>{c}</button>
        ))}
      </div>

      {/* Menu grid */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-48 bg-white rounded-2xl animate-pulse"/>)}</div>}
        {error && <p className="text-red-600 text-center py-8">Failed to load menu: {error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="text-stone-500 text-center py-8">No items found.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(i => (
            <div key={i.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden">
              <div className="relative">
                <img src={i.image_url} alt={i.name} className="w-full h-36 object-cover" />
                <span className={`absolute top-2 left-2 w-4 h-4 border-2 ${i.is_veg ? 'border-green-600' : 'border-red-600'} bg-white flex items-center justify-center`}>
                  <span className={`w-2 h-2 rounded-full ${i.is_veg ? 'bg-green-600' : 'bg-red-600'}`} />
                </span>
                {i.is_popular && <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">⭐ Popular</span>}
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{i.name}</h3>
                  <span className="text-xs text-stone-500">⭐ {i.rating}</span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">{i.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-orange-600">₹{i.price}</span>
                  <button onClick={() => add(i)} className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 active:scale-95 transition">Add +</button>
                </div>
                <div className="text-xs text-stone-400 mt-1">{i.prep_time}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-orange-600 text-white rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">{count} item{count>1?'s':''}</div>
            <div className="font-bold">₹{total}</div>
          </div>
          <Link href="/cart" className="px-4 py-2 bg-white text-orange-600 rounded-xl font-semibold text-sm">View Cart 🛒</Link>
        </div>
      )}
    </div>
  );
}
