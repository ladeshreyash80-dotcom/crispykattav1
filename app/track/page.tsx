'use client';
import { useState } from 'react';

export default function Track() {
  const [ref, setRef] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const steps = ['Order Received', 'Preparing in Kitchen', 'Ready for Pickup'];
  const statusIndex = order ? Math.min(order.step ?? 0, 2) : 0;

  const handleTrack = () => {
    const orders = JSON.parse(localStorage.getItem('ck_orders') || '[]');
    const found = orders.find((o: any) => o.reference === ref && o.phone === phone);
    if (!found) { setError('Order not found'); setOrder(null); return; }
    setError(null);
    setOrder(found);
  };

  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Track Order</h1>
      <div className="space-y-3 mb-6">
        <input value={ref} onChange={e => setRef(e.target.value)} className="w-full border rounded p-2" placeholder="Order reference (CK-XXXXXX)" />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2" placeholder="Mobile number" />
        <button onClick={handleTrack} className="w-full py-2 bg-brand text-white rounded-lg">Track</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {order && (
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="font-bold mb-2">Order {order.reference}</div>
          <div className="text-sm text-stone-600 mb-4">Ready in ~12 mins</div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs ${i <= statusIndex ? 'bg-brand text-white' : 'bg-stone-200 text-stone-500'}`}>{i + 1}</div>
                <div className="text-xs mt-1">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
