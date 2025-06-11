import {
  getToken,
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck,
} from '@firebase/app-check';
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
  }
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let appCheck: AppCheck | null = null;

// App Checkの初期化
if (typeof window !== 'undefined') {
  // 開発環境でのみデバッグトークンを有効化
  if (process.env.NODE_ENV === 'development') {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  // ReCAPTCHA Site Keyが設定されている場合のみApp Checkを初期化
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });

      if (process.env.NODE_ENV === 'development') {
        getToken(appCheck)
          .then(appCheckToken => {
            console.log(
              '🔐 Firebase App Check Token:',
              appCheckToken.token.substring(0, 20) + '...'
            );
          })
          .catch(error => {
            console.error('Firebase App Check Token取得エラー:', error);
          });
      }
    } catch (error) {
      console.error('Firebase App Check初期化エラー:', error);
    }
  } else {
    console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEYが設定されていません');
  }
}

export { app, appCheck };
