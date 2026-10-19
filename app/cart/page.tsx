'use client';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const packaging = items.length ? 5 : 0;
  const grand = total + packaging;
  return (
    <main className="p-4 max-w-3xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-500">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-lg">Browse Menu</Link>
        </div>
      )}
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm">
            <img src={i.image_url} alt={i.name} className="w-16 h-16 object-cover rounded-xl" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{i.name}</div>
              <div className="text-orange-600 font-bold text-sm">₹{i.price}</div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full border text-sm">-</button>
                <span className="text-sm font-semibold">{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full border text-sm">+</button>
                <button onClick={() => remove(i.id)} className="ml-auto text-xs text-red-500">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between text-sm"><span>Item Total</span><span>₹{total}</span></div>
          <div className="flex justify-between text-sm"><span>Packaging Fee</span><span>₹{packaging}</span></div>
          <div className="flex justify-between font-bold mt-2 border-t pt-2"><span>Total Payable</span><span>₹{grand}</span></div>
          <Link href="/checkout" className="mt-4 block text-center w-full py-3 bg-orange-600 text-white rounded-xl font-semibold">Proceed to Checkout</Link>
        </div>
      )}
    </main>
  );
}
