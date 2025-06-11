import { verifyAppCheckToken } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

/**
 * AppCheck トークンを検証するミドルウェア
 * @param request Next.js Request オブジェクト
 * @returns 検証結果とエラーレスポンス（検証失敗時）
 */
export async function verifyAppCheck(
  request: NextRequest
): Promise<{ isValid: boolean; errorResponse?: NextResponse }> {
  try {
    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'AppCheck トークンが必要です' },
          { status: 401 }
        ),
      };
    }

    // "Bearer " プレフィックスを削除してトークンを取得
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'AppCheck トークンが無効です' },
          { status: 401 }
        ),
      };
    }

    // AppCheck トークンを検証
    const isValidToken = await verifyAppCheckToken(token);

    if (!isValidToken) {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'AppCheck トークンの検証に失敗しました' },
          { status: 403 }
        ),
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('AppCheck 検証エラー:', error);
    return {
      isValid: false,
      errorResponse: NextResponse.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      ),
    };
  }
}

/**
 * AppCheck 検証付きのAPI ハンドラーを作成するヘルパー関数
 * @param handler 元のAPI ハンドラー
 * @returns AppCheck 検証付きのAPI ハンドラー
 */
export function withAppCheck<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // 開発環境でも AppCheck 検証を実行（デバッグトークン対応）
    const { isValid, errorResponse } = await verifyAppCheck(request);

    if (!isValid && errorResponse) {
      return errorResponse;
    }

    return handler(request, ...args);
  };
}
