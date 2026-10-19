'use client';
import { useRewards } from '@/lib/rewards';

export default function Profile() {
  const { coins } = useRewards();
  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      {/* VIP Passport */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl mb-4">
        <div className="text-sm opacity-90">Campus Foodie 🎓</div>
        <div className="text-xs opacity-80 mb-2">Block A, Room 302</div>
        <div className="flex items-center gap-2 text-2xl font-bold">🪙 {coins} Coins</div>
        <div className="text-xs opacity-90 mt-1">= ₹{(coins/10).toFixed(1)} Value</div>
        <div className="text-xs opacity-90 mt-2">Tier 2: Samosa Master 🥟 (15 coins to next free item)</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-3 shadow-card text-center"><div className="font-bold">12</div><div className="text-xs text-stone-500">Orders Placed</div></div>
        <div className="bg-white rounded-2xl p-3 shadow-card text-center"><div className="font-bold">4.9</div><div className="text-xs text-stone-500">Rating Given</div></div>
        <div className="bg-white rounded-2xl p-3 shadow-card text-center"><div className="font-bold">₹240</div><div className="text-xs text-stone-500">Saved</div></div>
      </div>

      {/* Saved locations */}
      <div className="bg-white rounded-3xl p-4 shadow-card mb-4">
        <div className="font-bold mb-2">Saved Delivery Locations</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Main Hostel, Room 302</span><button className="text-brand text-xs">Edit</button></div>
          <div className="flex justify-between"><span>Library Quiet Zone</span><button className="text-brand text-xs">Edit</button></div>
          <div className="flex justify-between"><span>Sports Complex Gate</span><button className="text-brand text-xs">Edit</button></div>
        </div>
        <button className="mt-3 w-full py-2 border border-dashed rounded-lg text-sm text-stone-500">+ Add New</button>
      </div>

      {/* Recent order reorder */}
      <div className="bg-white rounded-3xl p-4 shadow-card mb-4">
        <div className="font-bold mb-1">Recent Order</div>
        <div className="text-sm text-stone-600 mb-2">Paneer Momos x1 + Cold Coffee x1</div>
        <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm">🔄 Reorder</button>
      </div>

      {/* Owner entry */}
      <div className="bg-stone-100 rounded-3xl p-4 text-center">
        <div className="text-sm mb-2">Are you the stall owner?</div>
        <a href="/admin" className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm">🔑 Open Admin Portal</a>
      </div>
    </main>
  );
}
