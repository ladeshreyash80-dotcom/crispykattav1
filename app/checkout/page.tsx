'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const packaging = items.length ? 5 : 0;
  const grand = total + packaging;

  const placeOrder = () => {
    const reference = 'CK-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const order = { reference, customer_name: name, phone, address, instructions, total: grand, created_at: new Date().toISOString(), step: 0 };
    const orders = JSON.parse(localStorage.getItem('ck_orders') || '[]');
    orders.push(order);
    localStorage.setItem('ck_orders', JSON.stringify(orders));
    clear();
    router.push(`/track?ref=${reference}`);
  };

  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="space-y-3 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" placeholder="Name" />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2" placeholder="Mobile number" />
        <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-2" placeholder="Hostel / room / delivery location" />
        <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full border rounded p-2" placeholder="Instructions (optional)" />
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex justify-between text-sm"><span>Item Total</span><span>₹{total}</span></div>
        <div className="flex justify-between text-sm"><span>Packaging Fee</span><span>₹{packaging}</span></div>
        <div className="flex justify-between font-bold mt-2 border-t pt-2"><span>Total Payable</span><span>₹{grand}</span></div>
      </div>
      <button onClick={placeOrder} disabled={items.length === 0 || !name || !phone || !address} className="w-full py-3 bg-brand text-white rounded-xl font-semibold disabled:opacity-50">Place Order</button>
    </main>
  );
}
