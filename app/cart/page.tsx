'use client';
export default function Cart() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <p className="text-stone-600">Your cart is empty. Browse the menu to add items.</p>
      <a href="/menu" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-lg">Browse Menu</a>
    </main>
  );
}
