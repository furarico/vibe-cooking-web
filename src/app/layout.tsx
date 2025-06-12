import { DIProvider } from '@/client/di/providers';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { FirebaseInit } from './firebase-init';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vibe Cooking',
  description: 'Vibe Cooking',
  appleWebApp: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegistration />
        <FirebaseInit />
        <DIProvider>{children}</DIProvider>
      </body>
    </html>
  );
}
