import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Crispy Katta', description: 'Campus food ordering' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-orange-50 text-stone-900">{children}</body>
    </html>
  );
}
