import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/client-layout';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryProvider } from '@/components/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wav3 - Cross-border Cryptocurrency',
  description: 'Online Cross-border Cryptocurrency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} full-screen`}>
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
