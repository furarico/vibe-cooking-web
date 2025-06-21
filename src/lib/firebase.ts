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
  if (process.env.NODE_ENV === 'development') {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (recaptchaSiteKey) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });

    if (process.env.NODE_ENV === 'development') {
      getToken(appCheck).then(appCheckToken => {
        console.log('🔐 Firebase App Check:', appCheckToken.token);
      });
    }
  } else {
    console.warn(
      '⚠️ reCAPTCHA Site Key が設定されていません。Firebase App Check が無効です。'
    );
  }
}

export { app, appCheck };
