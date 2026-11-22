import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'TRUG by Focsera | Hyperlocal Neighbourhood Commerce',
  description: 'Discover nearby independent shops and order fresh everyday essentials delivered to your doorstep in 15-30 minutes.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF5F0] text-[#302B28] antialiased selection:bg-[#D97A5B] selection:text-white">
        <CartProvider>
          <AppShell>
            {children}
          </AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
