'use client';
import { useState, useEffect } from 'react';
import { MOCK_MENU } from '@/lib/mockMenu';
import { setCustomPhoto, resetCustomPhotos } from '@/lib/images';

const PIN = '1234';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('menu');
  const [items, setItems] = useState<any[]>(() => {
    if (typeof window === 'undefined') return MOCK_MENU;
    const saved = localStorage.getItem('ck_menu');
    return saved ? JSON.parse(saved) : MOCK_MENU;
  });
  const [marquee, setMarquee] = useState(() => typeof window === 'undefined' ? '' : (localStorage.getItem('ck_marquee') || '🔥 KADHI SAMOSA ₹35  ⚡ PERI PERI VADA ₹25'));
  const [storeStatus, setStoreStatus] = useState(() => typeof window === 'undefined' ? 'open' : (localStorage.getItem('ck_store_status') || 'open'));
  const [phone, setPhone] = useState(() => typeof window === 'undefined' ? '9763178587' : (localStorage.getItem('ck_phone') || '9763178587'));
  const [address, setAddress] = useState(() => typeof window === 'undefined' ? 'Campus Gate No. 2, University Road' : (localStorage.getItem('ck_address') || 'Campus Gate No. 2, University Road'));
  const [upi, setUpi] = useState(() => typeof window === 'undefined' ? 'crispykatta@upi' : (localStorage.getItem('ck_upi') || 'crispykatta@upi'));
  const [hours, setHours] = useState(() => typeof window === 'undefined' ? '10:00 - 23:00' : (localStorage.getItem('ck_hours') || '10:00 - 23:00'));
  const [orders, setOrders] = useState<any[]>(() => typeof window === 'undefined' ? [] : JSON.parse(localStorage.getItem('ck_orders') || '[]'));

  useEffect(() => { localStorage.setItem('ck_menu', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('ck_marquee', marquee); }, [marquee]);
  useEffect(() => { localStorage.setItem('ck_store_status', storeStatus); }, [storeStatus]);
  useEffect(() => { localStorage.setItem('ck_phone', phone); }, [phone]);
  useEffect(() => { localStorage.setItem('ck_address', address); }, [address]);
  useEffect(() => { localStorage.setItem('ck_upi', upi); }, [upi]);
  useEffect(() => { localStorage.setItem('ck_hours', hours); }, [hours]);

  if (!authed) {
    return (
      <main className="p-4 max-w-md mx-auto pb-32">
        <h1 className="text-2xl font-bold mb-4">Owner Login</h1>
        <input value={pin} onChange={e => setPin(e.target.value)} type="password" className="w-full border rounded p-2 mb-3" placeholder="PIN" />
        <button onClick={() => { if (pin === PIN) setAuthed(true); }} className="w-full py-2 bg-brand text-white rounded-lg">Sign in</button>
      </main>
    );
  }

  const addNewItem = () => {
    const name = prompt('Item name?');
    if (!name) return;
    const price = Number(prompt('Price?') || '0');
    const category = prompt('Category?') || 'Snacks';
    setItems(prev => [...prev, { id: 'm' + Date.now(), name, description: '', price, category, image_url: '', is_veg: true, is_popular: false, rating: 4.5, prep_time: '10 min', available: true }]);
  };

  const toggleStock = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  const deleteItem = (id: string) => { if (confirm('Delete?')) setItems(prev => prev.filter(i => i.id !== id)); };
  const updatePrice = (id: string, price: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, price } : i));

  const updateOrderStatus = (ref: string, status: string) => {
    const updated = orders.map(o => o.reference === ref ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('ck_orders', JSON.stringify(updated));
  };

  return (
    <main className="p-4 max-w-5xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['menu','marquee','settings','orders','verify'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm ${tab === t ? 'bg-brand text-white' : 'bg-white border'}`}>{t}</button>
        ))}
      </div>

      {tab === 'menu' && (
        <div>
          <button onClick={addNewItem} className="mb-3 px-4 py-2 bg-brand text-white rounded-lg text-sm">+ Add New Item</button>
          <button onClick={() => { resetCustomPhotos(); alert('Reset to defaults'); }} className="mb-3 ml-2 px-4 py-2 border rounded-lg text-sm">Reset to Default Photos</button>
          <div className="space-y-2">
            {items.map(i => (
              <div key={i.id} className="bg-white rounded-2xl p-3 shadow-card flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{i.name}</div>
                  <div className="text-xs text-stone-500">{i.category} • ₹
                    <input type="number" value={i.price} onChange={e => updatePrice(i.id, Number(e.target.value))} className="w-16 border rounded px-1 text-xs ml-1" />
                  </div>
                </div>
                <button onClick={() => toggleStock(i.id)} className={`px-3 py-1 text-xs rounded-full ${i.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.available ? 'In Stock' : 'Sold Out'}</button>
                <label className="px-3 py-1 text-xs rounded-full bg-stone-200 cursor-pointer">
                  📷 Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => { setCustomPhoto(i.id, r.result as string); alert('Photo saved'); };
                    r.readAsDataURL(f);
                  }} />
                </label>
                <button onClick={() => { const url = prompt('Image URL?'); if (url) { setCustomPhoto(i.id, url); alert('Photo saved'); } }} className="px-3 py-1 text-xs rounded-full bg-stone-200">🔗 Paste URL</button>
                <button onClick={() => deleteItem(i.id)} className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'marquee' && (
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="block text-sm font-semibold mb-1">Marquee text</label>
          <input value={marquee} onChange={e => setMarquee(e.target.value)} className="w-full border rounded p-2 text-sm" />
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Store status</label>
            <select value={storeStatus} onChange={e => setStoreStatus(e.target.value)} className="w-full border rounded p-2 text-sm">
              <option value="open">🟢 Store Open</option>
              <option value="closed">🔴 Store Closed</option>
              <option value="rush">🟡 High Rush</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone / WhatsApp</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">UPI ID</label>
            <input value={upi} onChange={e => setUpi(e.target.value)} className="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Operating hours</label>
            <input value={hours} onChange={e => setHours(e.target.value)} className="w-full border rounded p-2 text-sm" />
          </div>
        </div>
      )}

      {tab === 'verify' && (
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="block text-sm font-semibold mb-1">Enter voucher code</label>
          <input id="vcode" className="w-full border rounded p-2 text-sm mb-2" placeholder="CK-CHAI-8921" />
          <button onClick={() => {
            const code = (document.getElementById('vcode') as HTMLInputElement).value;
            const vs = JSON.parse(localStorage.getItem('ck_vouchers') || '[]');
            const idx = vs.findIndex((v: any) => v.code === code && !v.used);
            if (idx === -1) { alert('Invalid or already used'); return; }
            vs[idx].used = true;
            localStorage.setItem('ck_vouchers', JSON.stringify(vs));
            alert('Redeemed: ' + vs[idx].label);
          }} className="px-4 py-2 bg-brand text-white rounded-lg text-sm">Verify & Redeem</button>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 && <p className="text-stone-500">No orders yet.</p>}
          {orders.map((o: any) => (
            <div key={o.reference} className="bg-white rounded-2xl p-3 shadow-card">
              <div className="font-bold">{o.reference}</div>
              <div className="text-sm text-stone-600">{o.customer_name} • {o.phone}</div>
              <div className="text-sm">Total: ₹{o.total} • Status: {o.status || 'new'}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateOrderStatus(o.reference, 'preparing')} className="px-3 py-1 text-xs bg-amber-100 rounded-lg">Preparing</button>
                <button onClick={() => updateOrderStatus(o.reference, 'ready')} className="px-3 py-1 text-xs bg-green-100 rounded-lg">Ready</button>
                <button onClick={() => updateOrderStatus(o.reference, 'done')} className="px-3 py-1 text-xs bg-stone-200 rounded-lg">Done</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
