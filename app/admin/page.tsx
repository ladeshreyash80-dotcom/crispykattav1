export default function Admin() {
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-stone-600">Protected server-side. Sign in to manage orders, menu, and rewards.</p>
      <a href="/admin/login" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-lg">Sign in</a>
    </main>
  );
}
