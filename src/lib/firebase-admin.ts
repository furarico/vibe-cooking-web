import { getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

// Firebase Admin SDKの初期化
function initializeFirebaseAdmin() {
  // 既に初期化済みの場合はスキップ
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // 開発環境の場合はデバッグトークンを使用するため、初期化をスキップ可能
  if (process.env.NODE_ENV === 'development') {
    // 開発環境では GOOGLE_APPLICATION_CREDENTIALS が必須ではない
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log(
        '開発環境: GOOGLE_APPLICATION_CREDENTIALS が設定されていないため、デバッグトークンモードで動作します'
      );
      // デバッグトークン用のダミー初期化
      return initializeApp({
        projectId:
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'debug-project',
      });
    }
  } else {
    // 本番環境では GOOGLE_APPLICATION_CREDENTIALS が必須
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error(
        'GOOGLE_APPLICATION_CREDENTIALS 環境変数が設定されていません。サービスアカウントキーファイルのパスを指定してください。'
      );
    }
  }

  // GOOGLE_APPLICATION_CREDENTIALSを使用して初期化
  return initializeApp();
}

// 開発環境用のデバッグトークンかどうかを判定
function isDebugToken(token: string): boolean {
  const debugTokens = process.env.FIREBASE_DEBUG_TOKENS?.split(',') || [];
  return debugTokens.includes(token);
}

// AppCheck トークンを検証する関数
export async function verifyAppCheckToken(token: string): Promise<boolean> {
  try {
    // 開発環境でデバッグトークンを使用している場合
    if (process.env.NODE_ENV === 'development') {
      if (isDebugToken(token)) {
        console.log(
          '開発環境: デバッグトークンを使用してAppCheck検証をスキップします'
        );
        return true;
      }

      // 開発環境でもGOOGLE_APPLICATION_CREDENTIALSが設定されていない場合は
      // 本来のAppCheck検証を行わずに成功とする
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log(
          '開発環境: 認証情報未設定のため、全てのトークンを有効とします'
        );
        return true;
      }
    }

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
