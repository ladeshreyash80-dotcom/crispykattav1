'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { getImageUrl } from '@/lib/images';

const CATS = ['All','Momos','Rolls & Wraps','Snacks & Fries','Sandwiches','Beverages','Desserts'];

export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const { items: cartItems, add, setQty } = useCart();

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ck_menu') : null;
    if (saved) { setItems(JSON.parse(saved)); setLoading(false); return; }
    const ctrl = new AbortController();
    fetch('/api/menu', { signal: ctrl.signal })
      .then(async r => {
        const text = await r.text();
        let d: any = {};
        try { d = text ? JSON.parse(text) : {}; } catch { throw new Error('Invalid JSON response'); }
        if (!r.ok) throw new Error(d?.error || `HTTP ${r.status}`);
        setItems(Array.isArray(d.items) ? d.items : []);
      })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message || 'Failed to load menu'); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const cartQty = (id: string) => cartItems.find(c => c.id === id)?.qty || 0;

  const filtered = items.filter(i => {
    const matchCat = cat === 'All' || i.category === cat || (cat === 'Snacks & Fries' && (i.category === 'Snacks' || i.category === 'Fries')) || (cat === 'Beverages' && i.category === 'Beverages') || (cat === 'Desserts' && i.category === 'Desserts');
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && i.available !== false;
  });

  return (
    <main className="p-4 max-w-5xl mx-auto pb-36">
      <h1 className="text-2xl font-bold mb-3">Full Menu</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search samosas, momos, drinks..." className="w-full border rounded-full px-4 py-2 text-sm mb-3" />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${cat === c ? 'bg-brand text-white border-brand' : 'bg-white text-stone-700 border-stone-200'}`}>{c}</button>
        ))}
      </div>
      {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-48 bg-white rounded-2xl animate-pulse"/>)}</div>}
      {error && <p className="text-red-600">Failed to load menu: {error}</p>}
      {!loading && !error && filtered.length === 0 && <p className="text-stone-500">No items found.</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(i => {
          const q = cartQty(i.id);
          return (
            <div key={i.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="relative">
                <img src={getImageUrl(i)} alt={i.name} className="w-full h-36 object-cover rounded-t-2xl" />
                {i.is_popular && <span className="absolute top-2 left-2 bg-brand text-white text-xs px-2 py-0.5 rounded-full">🔥 Bestseller</span>}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 text-xs">🟢</span>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">{i.name}</h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{i.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-brand">₹{i.price}</span>
                  {q === 0 ? (
                    <button onClick={() => add(i)} className="px-4 py-1.5 bg-brand text-white text-xs rounded-lg font-bold hover:bg-orange-700">+ Add</button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(i.id, q - 1)} className="w-7 h-7 rounded-full border text-sm">-</button>
                      <span className="text-sm font-semibold">{q}</span>
                      <button onClick={() => setQty(i.id, q + 1)} className="w-7 h-7 rounded-full border text-sm">+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
