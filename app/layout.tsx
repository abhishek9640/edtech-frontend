import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from '@/components/providers/Providers';
import SimpleFooter from '@/components/layout/SimpleFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EdTech Platform - Learn & Grow',
  description: 'Modern learning management system built with Next.js 16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <main className="flex-1">
            {children}
          </main>
          <SimpleFooter />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
