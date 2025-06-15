import { getAppCheck } from 'firebase-admin/app-check';
import { NextRequest, NextResponse } from 'next/server';
import { app } from '../firebase-admin';

async function verifyAppCheck(
  request: NextRequest
): Promise<{ isValid: boolean; errorResponse?: NextResponse }> {
  try {
    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('X-Firebase-AppCheck');

    if (!authHeader) {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized' },
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
          { error: 'Unauthorized' },
          { status: 401 }
        ),
      };
    }

    // AppCheck トークンを検証
    const appCheckToken = await getAppCheck(app).verifyToken(token);

    if (!appCheckToken) {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        ),
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorResponse: NextResponse.json(
        { error: 'Internal Server Error' },
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
    const { isValid, errorResponse } = await verifyAppCheck(request);

    if (!isValid && errorResponse) {
      return errorResponse;
    }

    return handler(request, ...args);
  };
}
