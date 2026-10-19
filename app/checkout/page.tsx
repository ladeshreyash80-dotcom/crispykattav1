'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useRewards } from '@/lib/rewards';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { earn } = useRewards();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [payment, setPayment] = useState('Cash at Counter');
  const [waLink, setWaLink] = useState<string | null>(null);
  const packaging = items.length ? 5 : 0;
  const grand = total + packaging;

  const placeOrder = () => {
    const reference = 'CK-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const order = { reference, customer_name: name, phone, address, instructions, payment, total: grand, created_at: new Date().toISOString(), status: 'new', items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })) };
    const orders = JSON.parse(localStorage.getItem('ck_live_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('ck_live_orders', JSON.stringify(orders));
    earn(grand);
    clear();

    const lines = order.items.map(i => `- ${i.name} x${i.qty} (₹${i.price * i.qty})`).join('%0A');
    const msg = `👋 New Crispy Katta Order!%0ARef: ${reference}%0ACustomer: ${name} (${phone})%0ALocation: ${address}%0AItems:%0A${lines}%0ATotal: ₹${grand}%0APayment: ${payment}`;
    setWaLink(`https://wa.me/919763178587?text=${msg}`);
  };

  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="space-y-3 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" placeholder="Full Name" />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2" placeholder="Mobile Number (10 digits)" />
        <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-2" placeholder="Hostel Room / Table No. / Counter Pickup" />
        <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full border rounded p-2" placeholder="Instructions (optional)" />
        <select value={payment} onChange={e => setPayment(e.target.value)} className="w-full border rounded p-2">
          <option>UPI QR Code</option>
          <option>Cash at Counter</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex justify-between text-sm"><span>Item Total</span><span>₹{total}</span></div>
        <div className="flex justify-between text-sm"><span>Packaging Fee</span><span>₹{packaging}</span></div>
        <div className="flex justify-between font-bold mt-2 border-t pt-2"><span>Total Payable</span><span>₹{grand}</span></div>
      </div>
      {!waLink && <button onClick={placeOrder} disabled={items.length === 0 || !name || !phone || !address} className="w-full py-3 bg-brand text-white rounded-xl font-semibold disabled:opacity-50">Confirm & Place Order</button>}
      {waLink && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 bg-green-600 text-white rounded-xl font-semibold">🚀 Send Order to Stall on WhatsApp</a>
      )}
    </main>
  );
}
