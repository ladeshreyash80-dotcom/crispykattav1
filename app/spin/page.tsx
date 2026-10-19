'use client';
import { useState } from 'react';

const PRIZES = ['🪙 20 Katta Coins', '🏷️ ₹10 OFF Coupon', '☕ Free Kulhad Chai', '🍟 Free Fries Add-on', 'Better luck next time'];

export default function Spin() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const res = await fetch('/api/spin', { method: 'POST' });
    const data = await res.json();
    const target = (data.index ?? 0) * (360 / PRIZES.length);
    setRotation(prev => prev + 360 * 5 + target);
    setTimeout(() => { setResult(data.prize); setSpinning(false); }, 3000);
  };

  return (
    <main className="p-4 max-w-3xl mx-auto pb-32 flex flex-col items-center">
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Daily campus lucky wheel</div>
        <h1 className="font-display text-3xl font-bold">🎰 SPIN & WIN</h1>
      </div>
      <div className="relative w-72 h-72 mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-3xl">▼</div>
        <div
          className="w-72 h-72 rounded-full border-8 border-brand overflow-hidden transition-transform duration-[3000ms] ease-out shadow-xl"
          style={{ transform: `rotate(${rotation}deg)`, background: 'conic-gradient(#E04F16 0deg 72deg, #D4A017 72deg 144deg, #10B981 144deg 216deg, #8B5CF6 216deg 288deg, #3B82F6 288deg 360deg)' }}
        >
          {PRIZES.map((p, i) => (
            <div key={p} className="absolute w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{ transform: `rotate(${i * (360 / PRIZES.length) + 36}deg) translateY(-110px)` }}>
              {p}
            </div>
          ))}
        </div>
      </div>
      <button onClick={spin} disabled={spinning} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-lg shadow-lg disabled:opacity-50 animate-pulse">
        {spinning ? 'Spinning...' : '🚀 SPIN THE WHEEL'}
      </button>
      {result && <div className="mt-6 bg-white rounded-2xl p-4 shadow-card text-center font-bold text-lg">🎉 You won: {result}!</div>}
      <div className="mt-6 w-full">
        <div className="text-sm font-bold mb-2">Prizes</div>
        <ul className="text-sm space-y-1">
          <li>🪙 20 Katta Coins</li>
          <li>🏷️ ₹10 OFF Coupon</li>
          <li>☕ Free Kulhad Chai</li>
          <li>🍟 Free Fries Add-on</li>
        </ul>
        <div className="text-xs text-stone-500 mt-3">Next spin available in 14h 22m if already spun today.</div>
      </div>
    </main>
  );
}
