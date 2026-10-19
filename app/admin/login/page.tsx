'use client';
export default function AdminLogin() {
  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Sign In</h1>
      <form className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" type="email" />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" />
        <button className="w-full py-2 bg-orange-600 text-white rounded-lg">Sign in</button>
      </form>
    </main>
  );
}
