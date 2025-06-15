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
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-2xl min-h-screen mx-auto p-4 bg-slate-50`}
      >
        <DIProvider>
          <ServiceWorkerRegistration />
          <FirebaseInit />
          <Header />
          <main className="w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          <Toaster />
        </DIProvider>
      </body>
    </html>
  );
}
