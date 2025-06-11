import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

// Firebase Admin SDKの初期化
function initializeFirebaseAdmin() {
  // 既に初期化済みの場合はスキップ
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // 環境変数から認証情報を取得
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin SDK の必要な環境変数が設定されていません');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });
}

// AppCheck トークンを検証する関数
export async function verifyAppCheckToken(token: string): Promise<boolean> {
  try {
    const app = initializeFirebaseAdmin();
    const appCheck = getAppCheck(app);

    await appCheck.verifyToken(token);
    return true;
  } catch (error) {
    console.error('AppCheck トークン検証エラー:', error);
    return false;
  }
}

// Firebase Admin SDK インスタンスを取得する関数
export function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}
