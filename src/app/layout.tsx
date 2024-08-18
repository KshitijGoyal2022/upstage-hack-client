import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/navbar';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Auth from '@/components/Auth';
import TranslationChat from '@/components/TranslationChat';
import Head from 'next/head'; // Import Head

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Traventure',
  description: 'Ready, set, go anywhere!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Head>
        {/* If you're using another file format like .png or .svg */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <body className={inter.className}>
        <AuthProvider>
          <Auth />
          <Navbar />
          {children}
          <TranslationChat />
        </AuthProvider>
      </body>
    </html>
  );
}
