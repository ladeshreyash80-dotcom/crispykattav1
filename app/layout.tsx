import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cart';
export const metadata: Metadata = { title: 'Crispy Katta', description: 'Campus food ordering' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50/40 text-stone-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
