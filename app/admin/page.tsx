'use client';
import { useState } from 'react';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);

  if (!authed) {
    return (
      <main className="p-4 max-w-md mx-auto pb-32">
        <h1 className="text-2xl font-bold mb-4">Owner Login</h1>
        <input value={pin} onChange={e => setPin(e.target.value)} type="password" className="w-full border rounded p-2 mb-3" placeholder="PIN" />
        <button onClick={() => { if (pin === '1234') setAuthed(true); }} className="w-full py-2 bg-brand text-white rounded-lg">Sign in</button>
      </main>
    );
  }

  const orders = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('ck_orders') || '[]') : '[]');

  return (
    <main className="p-4 max-w-5xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="mb-6 flex items-center gap-3">
        <span>Store Status:</span>
        <button onClick={() => setStoreOpen(!storeOpen)} className={`px-4 py-2 rounded-full text-white ${storeOpen ? 'bg-green-600' : 'bg-red-600'}`}>
          {storeOpen ? 'Store Open 🟢' : 'Store Closed 🔴'}
        </button>
      </div>
      <h2 className="text-xl font-bold mb-2">Live Orders</h2>
      <div className="space-y-3">
        {orders.length === 0 && <p className="text-stone-500">No orders yet.</p>}
        {orders.map((o: any) => (
          <div key={o.reference} className="bg-white rounded-2xl p-3 shadow-card">
            <div className="font-bold">{o.reference}</div>
            <div className="text-sm text-stone-600">{o.customer_name} • {o.phone}</div>
            <div className="text-sm">Total: ₹{o.total}</div>
            <div className="text-xs text-stone-400">{o.created_at}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
