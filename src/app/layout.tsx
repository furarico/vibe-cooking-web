import { Footer } from '@/app/footer';
import { Header } from '@/app/header';
import ServiceWorkerRegistration from '@/app/service-worker-registration';
import { DIProvider } from '@/client/di/providers';
import { Toaster } from '@/components/ui/sonner';
import {
  ButtomButtons,
  ButtomButtonsProvider,
} from '@/contexts/buttom-buttons-context';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
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
  itunes: {
    appId: '6747516551',
    appArgument: 'https://vibe-cooking.app/',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-w-xs h-screen pb-[env(safe-area-inset-bottom)] bg-slate-50 overflow-hidden`}
      >
        <DIProvider>
          <ButtomButtonsProvider>
            <ServiceWorkerRegistration />
            <FirebaseInit />
            <div className="h-full flex flex-col">
              <Header className="container mx-auto p-4" />
              <main className="w-full h-full container mx-auto p-4 overflow-y-scroll scrollbar-hide">
                {children}
                <Footer className="container p-6 pb-[env(safe-area-inset-bottom)]" />
              </main>
              <ButtomButtons className="pb-[env(safe-area-inset-bottom)]" />
            </div>
            <Toaster />
          </ButtomButtonsProvider>
        </DIProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
