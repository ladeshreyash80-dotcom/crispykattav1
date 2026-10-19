'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';

const items = [
  { href: '/menu', label: 'Menu', icon: '🍽️' },
  { href: '/track', label: 'Track', icon: '📦' },
  { href: '/cart', label: 'Cart', icon: '🛒' },
  { href: '/store', label: 'Store', icon: '🏪' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
      {items.map(it => {
        const active = pathname === it.href;
        return (
          <Link key={it.href} href={it.href} className={`flex flex-col items-center text-xs ${active ? 'text-brand font-semibold' : 'text-stone-500'}`}>
            <span className="text-lg relative">
              {it.icon}
              {it.label === 'Cart' && count > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
              )}
            </span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
