import { initializeAppCheck, ReCaptchaV3Provider } from '@firebase/app-check';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// App Checkの初期化
if (typeof window !== 'undefined') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
    ),
    isTokenAutoRefreshEnabled: true,
  });

  // 開発環境でデバッグトークンをコンソールに表示
  if (process.env.NODE_ENV === 'development') {
    import('@firebase/app-check').then(({ getToken }) => {
      getToken(appCheck, true)
        .then(tokenResult => {
          console.log('🔐 Firebase App Check Debug Token:', tokenResult.token);
          console.log(
            '💡 この開発用デバッグトークンをFIREBASE_DEBUG_TOKENS環境変数に追加してください'
          );
        })
        .catch(error => {
          console.error('❌ App Check debug token取得エラー:', error);
        });
    });
  }
}

export { app };
