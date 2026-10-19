'use client';
import { useEffect, useState } from 'react';
export default function Menu() {
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
    <main className="p-4 max-w-5xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      {loading && <p className="text-stone-500">Loading menu…</p>}
      {error && <p className="text-red-600">Failed to load menu: {error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-stone-500">No menu items available.</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((i:any)=>(
          <div key={i.id} className="border rounded-lg p-3 bg-white">
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-stone-600">{i.description}</div>
            <div className="mt-2 font-bold text-orange-600">₹{i.price}</div>
            {i.available ? <button className="mt-2 text-sm px-3 py-1 bg-orange-600 text-white rounded">Add</button> : <span className="text-red-500 text-sm">Sold out</span>}
          </div>
        ))}
      </div>
    </main>
  );
}
