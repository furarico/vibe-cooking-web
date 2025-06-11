import { getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

// Firebase Admin SDKの初期化
function initializeFirebaseAdmin() {
  // 既に初期化済みの場合はスキップ
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // GOOGLE_APPLICATION_CREDENTIALSが設定されているかチェック
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS 環境変数が設定されていません。サービスアカウントキーファイルのパスを指定してください。'
    );
  }

  // GOOGLE_APPLICATION_CREDENTIALSを使用して初期化
  // credentialを明示的に指定せず、デフォルトの認証方法を使用
  return initializeApp();
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
