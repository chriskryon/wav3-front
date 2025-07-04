import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/client-layout';
import { RouteChangeLoader } from '@/components/RouteChangeLoader';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryProvider } from '@/components/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wav3 - Cross-border Cryptocurrency',
  description: 'Online Cross-border Cryptocurrency',
  openGraph: {
    title: 'Wav3 - Cross-border Cryptocurrency',
    description: 'Online Cross-border Cryptocurrency',
    url: 'https://staging-wav3.vercel.app/',
    siteName: 'Wav3',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wav3 Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wav3 - Cross-border Cryptocurrency',
    description: 'Online Cross-border Cryptocurrency',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} full-screen`}>
        <RouteChangeLoader />
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
