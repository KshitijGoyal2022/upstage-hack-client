import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travel Application',
  description: 'Ready, set, go anywhere!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          </AuthProvider>
      </body>
    </html>
  );
}
