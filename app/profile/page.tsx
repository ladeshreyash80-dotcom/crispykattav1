'use client';
import { useRewards } from '@/lib/rewards';

export default function Profile() {
  const { coins } = useRewards();
  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="font-bold">Katta Coins</div>
        <div className="text-2xl text-brand font-bold mt-1">🪙 {coins}</div>
        <p className="text-xs text-stone-500 mt-2">Earn 1 coin per ₹10 spent.</p>
      </div>
    </main>
  );
}
