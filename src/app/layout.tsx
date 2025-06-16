import { DIProvider } from '@/client/di/providers';
import { Header } from '@/components/header';
import ServiceWorkerRegistration from '@/components/service-worker-registration';
import { Toaster } from '@/components/ui/sonner';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-w-xs max-w-xl min-h-screen mx-auto p-2 bg-slate-50`}
      >
        <DIProvider>
          <ServiceWorkerRegistration />
          <FirebaseInit />
          <Header />
          <main className="w-full p-2">{children}</main>
          <Toaster />
        </DIProvider>
      </body>
    </html>
  );
}
