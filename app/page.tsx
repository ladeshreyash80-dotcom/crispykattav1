'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-orange-600">Crispy Katta</h1>
      <p className="mt-2 text-stone-700">Campus café & snacks. Order crispy samosas, momos, rolls & more.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/menu" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Browse Menu</Link>
        <Link href="/cart" className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg">Cart</Link>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Popular items</h2>
        {loading && <p className="text-stone-500">Loading menu…</p>}
        {error && <p className="text-red-600">Failed to load menu: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-stone-500">No menu items available right now.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.slice(0, 6).map((i: any) => (
            <div key={i.id} className="border rounded-lg p-3 bg-white shadow-sm">
              {i.image_url && <img src={i.image_url} alt={i.name} className="w-full h-32 object-cover rounded" />}
              <div className="font-semibold mt-2">{i.name}</div>
              <div className="text-sm text-stone-600">{i.description}</div>
              <div className="mt-2 font-bold text-orange-600">₹{i.price}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
