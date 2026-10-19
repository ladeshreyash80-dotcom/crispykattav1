'use client';
import { useState } from 'react';

const PRIZES = ['₹5 off', '₹10 off', 'Free add-on', 'Bonus 20 coins', 'Better luck next time'];

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
      <h1 className="text-2xl font-bold mb-4">Spin & Win 🎡</h1>
      <div className="relative w-64 h-64 mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-2xl">▼</div>
        <div
          className="w-64 h-64 rounded-full border-8 border-brand overflow-hidden transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)`, background: 'conic-gradient(#E04F16 0deg 72deg, #F59E0B 72deg 144deg, #10B981 144deg 216deg, #3B82F6 216deg 288deg, #8B5CF6 288deg 360deg)' }}
        >
          {PRIZES.map((p, i) => (
            <div key={p} className="absolute w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{ transform: `rotate(${i * (360 / PRIZES.length) + 36}deg) translateY(-90px)` }}>
              {p}
            </div>
          ))}
        </div>
      </div>
      <button onClick={spin} disabled={spinning} className="px-8 py-3 bg-brand text-white rounded-full font-bold text-lg disabled:opacity-50">
        {spinning ? 'Spinning...' : 'SPIN NOW'}
      </button>
      {result && <div className="mt-6 bg-white rounded-2xl p-4 shadow-card text-center font-bold">You won: {result}! 🎉</div>}
      <p className="text-xs text-stone-500 mt-4 text-center">One spin per day. Prizes subject to terms.</p>
    </main>
  );
}
