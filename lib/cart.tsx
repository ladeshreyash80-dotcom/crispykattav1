'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = { id: string; name: string; price: number; image_url: string; qty: number };
type Ctx = { items: CartItem[]; add: (i: any) => void; remove: (id: string) => void; setQty: (id: string, q: number) => void; total: number; count: number; clear: () => void };
const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const add = (i: any) => setItems(prev => {
    const ex = prev.find(x => x.id === i.id);
    if (ex) return prev.map(x => x.id === i.id ? { ...x, qty: x.qty + 1 } : x);
    return [...prev, { id: i.id, name: i.name, price: i.price, image_url: i.image_url, qty: 1 }];
  });
  const remove = (id: string) => setItems(prev => prev.filter(x => x.id !== id));
  const setQty = (id: string, q: number) => setItems(prev => q <= 0 ? prev.filter(x => x.id !== id) : prev.map(x => x.id === id ? { ...x, qty: q } : x));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const clear = () => setItems([]);
  return <CartContext.Provider value={{ items, add, remove, setQty, total, count, clear }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error('useCart outside provider');
  return c;
}
