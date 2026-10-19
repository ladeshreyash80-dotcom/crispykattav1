'use client';
import { useEffect, useState } from 'react';
export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/menu').then(r=>r.json()).then(d=>setItems(d.items||[])); }, []);
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
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
