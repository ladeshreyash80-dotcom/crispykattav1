import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cart';
import BottomNav from '@/components/BottomNav';
export const metadata: Metadata = { title: 'Crispy Katta', description: 'Campus food ordering' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50/40 text-stone-900 pb-16">
        <CartProvider>
          {children}
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
