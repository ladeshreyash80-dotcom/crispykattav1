import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { RewardsProvider } from '@/lib/rewards';
import BottomNav from '@/components/BottomNav';
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
export const metadata: Metadata = { title: 'Crispy Katta', description: 'Campus food ordering' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-cream text-charcoal pb-16">
        <CartProvider>
          <RewardsProvider>
            {children}
            <BottomNav />
          </RewardsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
