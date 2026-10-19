'use client';
export default function Checkout() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Name" />
        <input className="w-full border rounded p-2" placeholder="Mobile number" />
        <input className="w-full border rounded p-2" placeholder="Hostel / room / delivery location" />
        <textarea className="w-full border rounded p-2" placeholder="Instructions (optional)" />
        <button className="w-full py-2 bg-orange-600 text-white rounded-lg">Place Order</button>
      </form>
    </main>
  );
}
