'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const CATS = [
  { emoji: '🥟', name: 'Momos' },
  { emoji: '🌯', name: 'Rolls' },
  { emoji: '🍟', name: 'Snacks' },
  { emoji: '🥪', name: 'Sandwich' },
  { emoji: '🍔', name: 'Burgers' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '☕', name: 'Chai' },
  { emoji: '🥤', name: 'Shakes' },
  { emoji: '🍨', name: 'Sweets' },
];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [spice, setSpice] = useState('Medium');
  const [addons, setAddons] = useState<string[]>([]);
  const { add, count, total } = useCart();

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ck_menu') : null;
    if (saved) { setItems(JSON.parse(saved)); setLoading(false); return; }
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

  const openModal = (i: any) => { setSelected(i); setSpice('Medium'); setAddons([]); };
  const modalPrice = selected ? selected.price + addons.reduce((s, a) => s + (a === 'Extra Cheese' ? 20 : a === 'Extra Chutney' ? 10 : 15), 0) : 0;

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center">👤</div>
              <div>
                <div className="text-xs text-stone-500">Good morning,</div>
                <div className="font-bold text-sm">Campus Foodie! 👋</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">🪙 85 Coins</div>
              <Link href="/cart" className="relative bg-charcoal text-white px-3 py-1.5 rounded-full text-sm">🛒
                {count > 0 && <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
              </Link>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between bg-white rounded-full px-4 py-2 text-sm shadow-card">
            <span>📍 Main Canteen, Block A ▾</span>
            <span className="text-xs text-stone-500">Delivering in ~15 mins</span>
          </div>
          <div className="mt-2 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-card">
            <span>🔍</span>
            <input placeholder="Search 'Paneer Momos', 'Kulhad Chai'..." className="flex-1 text-sm outline-none" />
            <span>⚙️</span>
          </div>
        </div>
      </header>

      {/* Hero banners */}
      <section className="max-w-6xl mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
        <div className="min-w-[280px] bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl p-5">
          <div className="font-bold text-lg">Hungry between classes?</div>
          <div className="text-sm opacity-90 mt-1">Get crispy Samosas & Chai delivered hot in 10 mins 🚀</div>
          <Link href="/menu" className="mt-3 inline-block px-4 py-2 bg-white text-orange-600 rounded-full text-sm font-semibold">Order Now</Link>
        </div>
        <div className="min-w-[280px] bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-3xl p-5">
          <div className="font-bold text-lg">Flat 20% OFF on Momos! 🥟</div>
          <div className="text-sm opacity-90 mt-1">Use code: MOMO20 at checkout</div>
        </div>
      </section>

      {/* Real campus stall */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">Visit our stall at gate no. 2</div>
          <h2 className="font-display text-xl font-bold mb-3">The stall</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" alt="Aerial" className="w-full h-28 object-cover rounded-2xl" />
            <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80" alt="Stall front" className="w-full h-28 object-cover rounded-2xl" />
          </div>
          <div className="text-xs text-stone-600 mb-2">Outside Campus Gate 2 • Under the Banyan Tree</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">🟢 Open Now (10:00 - 23:00)</span>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">⚡ ~12 min prep</span>
          </div>
        </div>
        <div className="mt-3 bg-brand/10 border border-brand/30 rounded-full px-4 py-2 text-sm text-center">🔥 18 campus students ordered in the last 30 mins!</div>
      </section>

      {/* Circular categories */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {CATS.map(c => (
            <button key={c.name} className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center text-2xl ring-2 ring-transparent hover:ring-brand hover:bg-orange-50">{c.emoji}</div>
              <span className="text-xs text-stone-600">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular items */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="font-display text-xl font-bold mb-3">Popular right now</h2>
        {loading && <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-48 bg-white rounded-2xl animate-pulse"/>)}</div>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popular.map(i => (
            <div key={i.id} onClick={() => openModal(i)} className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer">
              <div className="relative">
                <img src={i.image_url} alt={i.name} className="w-full h-32 object-cover" />
                <span className="absolute top-2 left-2 text-xs">🟢</span>
                {i.is_popular && <span className="absolute top-2 right-2 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full">🔥 Popular</span>}
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">⭐ 4.6</span>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">⏱️ 12 min</span>
              </div>
              <div className="p-2">
                <div className="font-bold text-gray-900 text-sm">{i.name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{i.description}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-brand text-sm">₹{i.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40 bg-emerald-600 text-white rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">{count} ITEMS | ₹{total}</div>
            <div className="text-xs opacity-90">Extra discount applied</div>
          </div>
          <Link href="/cart" className="px-4 py-2 bg-white text-emerald-600 rounded-xl font-semibold text-sm">View Cart 🛒 →</Link>
        </div>
      )}

      {/* Bottom sheet modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-xl">✕</button>
            <img src={selected.image_url} alt={selected.name} className="w-full h-40 object-cover rounded-2xl mb-3" />
            <div className="font-bold text-lg">{selected.name}</div>
            <div className="text-sm text-stone-500 mb-2">{selected.description}</div>
            <div className="font-bold text-brand mb-3">₹{selected.price}</div>
            <div className="mb-3">
              <div className="text-sm font-semibold mb-1">Choose Spice Level</div>
              <div className="flex gap-2">
                {['Mild','Medium','Extra Spicy 🌶️'].map(s => (
                  <button key={s} onClick={() => setSpice(s)} className={`px-3 py-1.5 rounded-full text-xs border ${spice===s ? 'bg-brand text-white border-brand' : 'bg-white border-stone-200'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1">Add-ons</div>
              {['Extra Cheese','Extra Chutney','Mayo Dip'].map(a => (
                <label key={a} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={addons.includes(a)} onChange={e => setAddons(e.target.checked ? [...addons, a] : addons.filter(x => x !== a))} />
                  {a} {a === 'Extra Cheese' ? '+₹20' : a === 'Extra Chutney' ? '+₹10' : '+₹15'}
                </label>
              ))}
            </div>
            <button onClick={() => { add(selected); setSelected(null); }} className="w-full py-3 bg-brand text-white rounded-xl font-semibold">Add to Cart • ₹{modalPrice}</button>
          </div>
        </div>
      )}
    </div>
  );
}
