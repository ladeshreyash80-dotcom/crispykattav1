'use client';
export default function Track() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Order</h1>
      <p className="text-stone-600">Enter your order reference and phone number to track.</p>
      <form className="mt-4 space-y-3">
        <input className="w-full border rounded p-2" placeholder="Order reference (CK-XXXXXX)" />
        <input className="w-full border rounded p-2" placeholder="Mobile number" />
        <button className="w-full py-2 bg-orange-600 text-white rounded-lg">Track</button>
      </form>
    </main>
  );
}
