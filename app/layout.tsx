import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'Admin dashboard',
  description:
    'Professional trading platform for cryptocurrencies, forex, and commodities with institutional-grade tools and lightning-fast execution.',
  icons: [
    {
      url: '/iconlogo.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/iconlogo.png',
      sizes: '64x64',
      type: 'image/png',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}