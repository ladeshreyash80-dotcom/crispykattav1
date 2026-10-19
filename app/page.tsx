export default function Home() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-orange-600">Crispy Katta</h1>
      <p className="mt-2 text-stone-700">Campus café & snacks. Order crispy samosas, momos, rolls & more.</p>
      <div className="mt-6 flex gap-3">
        <a href="/menu" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Browse Menu</a>
        <a href="/cart" className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg">Cart</a>
      </div>
    </main>
  );
}
