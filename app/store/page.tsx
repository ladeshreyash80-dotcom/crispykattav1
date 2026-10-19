'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRewards } from '@/lib/rewards';

export default function Store() {
  const { coins, redeem, spin } = useRewards();
  const [feedback, setFeedback] = useState<{ name: string; rating: number; text: string; time: string }[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('ck_feedback') || '[]');
  });
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [vouchers, setVouchers] = useState<any[]>(() => typeof window === 'undefined' ? [] : JSON.parse(localStorage.getItem('ck_vouchers') || '[]'));

  const claimReward = (cost: number, label: string) => {
    if (!redeem(cost)) return;
    const code = 'CK-' + label.split(' ')[1]?.toUpperCase()?.slice(0,4) + '-' + Math.floor(1000 + Math.random() * 9000);
    const v = { code, label, used: false, created: new Date().toISOString() };
    const updated = [v, ...vouchers];
    setVouchers(updated);
    localStorage.setItem('ck_vouchers', JSON.stringify(updated));
  };

  const submitFeedback = () => {
    const entry = { name, rating, text, time: new Date().toLocaleString() };
    const updated = [entry, ...feedback];
    setFeedback(updated);
    localStorage.setItem('ck_feedback', JSON.stringify(updated));
    setName(''); setText('');
  };

  const rewards = [
    { cost: 30, label: 'Free Kulhad Chai' },
    { cost: 50, label: 'Free Crispy Samosa' },
    { cost: 100, label: 'Free Paneer Momos' },
    { cost: 150, label: 'Free Cold Coffee' },
  ];

  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      {/* The Stall */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">Find the red and yellow board</div>
        <h1 className="font-display text-2xl font-bold mb-2">The stall</h1>
        <p className="text-stone-600 text-sm mb-3">Right outside Campus Gate No. 2, under the banyan tree. Follow the queue and the smell of ghee.</p>
        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">🔴 Closed right now</span>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="font-bold text-sm mb-1">Hours</div>
          <div className="text-xs text-stone-600">Mon – Sun | 10:00 – 23:00 (Kitchen closes 15 min before)</div>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="font-bold text-sm mb-1">Contact</div>
          <div className="text-xs text-stone-600 mb-2">Call or WhatsApp for bulk orders: 9763178587</div>
          <a href="https://wa.me/919763178587" className="text-xs text-brand font-semibold">WhatsApp ↗</a>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="font-bold text-sm mb-1">Address</div>
          <div className="text-xs text-stone-600 mb-2">Campus Gate No. 2, University Road</div>
          <a href="#" className="text-xs text-brand font-semibold">Open in Maps ↗</a>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="font-bold mb-2">Delivery area & fees</div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>Radius: 3 km</div>
          <div>Delivery fee: ₹30</div>
          <div>Free delivery: above ₹199</div>
          <div>Min order: ₹99</div>
          <div>Time: ~30 min</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Main Hostel','Girls Hostel','Library Row','Sports Complex','Gate 1 Road','Faculty Quarters'].map(t => (
            <span key={t} className="bg-stone-100 text-xs px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Pickup */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="font-bold mb-1">Pickup</div>
        <p className="text-xs text-stone-600 mb-3">Order ahead and collect from the counter. Show your reference — we keep it hot in the foil.</p>
        <div className="flex gap-2">
          <Link href="/menu" className="px-4 py-2 bg-brand text-white rounded-lg text-sm">Order for pickup</Link>
          <button className="px-4 py-2 border rounded-lg text-sm">Terms</button>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="space-y-3 mb-4">
        <img src="/images/stall/shopfront.jpg" alt="Stall" className="w-full h-40 object-cover rounded-3xl shadow-card" />
        <img src="/images/stall/aerial.png" alt="Aerial" className="w-full h-40 object-cover rounded-3xl shadow-card" />
        <img src="/images/stall/menu-board.jpg" alt="Menu board" className="w-full h-40 object-cover rounded-3xl shadow-card" />
      </div>

      {/* Rewards */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">Katta Coins 🪙</div>
          <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">🪙 {coins} Coins</div>
        </div>
        <div className="space-y-2 mb-4">
          {rewards.map(r => (
            <div key={r.cost} className="flex items-center justify-between text-sm">
              <span>🪙 {r.cost} Coins → {r.label}</span>
              <button onClick={() => claimReward(r.cost, r.label)} className="px-3 py-1 bg-brand text-white text-xs rounded-lg">Claim Reward</button>
            </div>
          ))}
        </div>
        <button onClick={() => { const w = spin(); setSpinResult(w); }} className="w-full py-2 bg-charcoal text-white rounded-lg text-sm">Daily Lucky Spin</button>
        {spinResult !== null && <p className="text-sm mt-2 text-center">You won {spinResult} coins! 🎉</p>}
      </div>

      {/* Vouchers */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="font-bold mb-2">Your Vouchers</div>
        {vouchers.length === 0 && <p className="text-xs text-stone-500">No vouchers yet.</p>}
        {vouchers.map(v => (
          <div key={v.code} className="border rounded-xl p-3 mb-2">
            <div className="font-bold text-sm">{v.label}</div>
            <div className="text-xs text-stone-600">Code: {v.code} {v.used ? '(USED)' : ''}</div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-3xl p-5 shadow-card mb-4">
        <div className="font-bold mb-3">How was it?</div>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2 mb-2 text-sm" placeholder="Student Name (e.g. Priya, FY BSc)" />
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} className={`text-xl ${n <= rating ? 'text-amber-500' : 'text-stone-300'}`}>★</button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border rounded p-2 mb-2 text-sm" placeholder="The peri peri vada was..." />
        <button onClick={submitFeedback} className="w-full py-2 bg-brand text-white rounded-lg text-sm">Send feedback</button>
        <div className="mt-4 space-y-2">
          <div className="text-xs uppercase tracking-widest text-stone-500">Recent feedback</div>
          {feedback.map((f, i) => (
            <div key={i} className="border rounded-xl p-3">
              <div className="font-semibold text-sm">{f.name} <span className="text-amber-500">{'★'.repeat(f.rating)}</span></div>
              <div className="text-xs text-stone-600">{f.text}</div>
              <div className="text-xs text-stone-400 mt-1">{f.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Owner login */}
      <div className="text-center">
        <Link href="/admin" className="text-xs text-stone-400">🔑 Owner Login</Link>
      </div>
    </main>
  );
}
