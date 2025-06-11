/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import * as firebaseAdmin from '../../firebase-admin';
import { verifyAppCheck, withAppCheck } from '../app-check';

// Firebase Admin のモック
jest.mock('../../firebase-admin', () => ({
  verifyAppCheckToken: jest.fn(),
}));

describe('AppCheck Middleware', () => {
  const mockVerifyAppCheckToken =
    firebaseAdmin.verifyAppCheckToken as jest.MockedFunction<
      typeof firebaseAdmin.verifyAppCheckToken
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    // 本番環境をシミュレート
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    // 環境変数をリセット
    process.env.NODE_ENV = 'test';
  });

  describe('verifyAppCheck', () => {
    it('有効なAppCheckトークンで成功する', async () => {
      mockVerifyAppCheckToken.mockResolvedValue(true);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      const result = await verifyAppCheck(request);

      expect(result.isValid).toBe(true);
      expect(result.errorResponse).toBeUndefined();
      expect(mockVerifyAppCheckToken).toHaveBeenCalledWith('valid-token');
    });

    it('Authorizationヘッダーがない場合は失敗する', async () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const result = await verifyAppCheck(request);

      expect(result.isValid).toBe(false);
      expect(result.errorResponse?.status).toBe(401);
      expect(mockVerifyAppCheckToken).not.toHaveBeenCalled();
    });

    it('無効なトークンで失敗する', async () => {
      mockVerifyAppCheckToken.mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      const result = await verifyAppCheck(request);

      expect(result.isValid).toBe(false);
      expect(result.errorResponse?.status).toBe(403);
      expect(mockVerifyAppCheckToken).toHaveBeenCalledWith('invalid-token');
    });

    it('トークン検証エラーでサーバーエラーを返す', async () => {
      mockVerifyAppCheckToken.mockRejectedValue(new Error('Firebase error'));

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer error-token',
        },
      });

      const result = await verifyAppCheck(request);

      expect(result.isValid).toBe(false);
      expect(result.errorResponse?.status).toBe(500);
    });
  });

  describe('withAppCheck', () => {
    const mockHandler = jest.fn();

    beforeEach(() => {
      mockHandler.mockClear();
    });

    it('開発環境ではAppCheck検証をスキップする', async () => {
      process.env.NODE_ENV = 'development';
      const wrappedHandler = withAppCheck(mockHandler);

      const request = new NextRequest('http://localhost:3000/api/test');

      await wrappedHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(request);
      expect(mockVerifyAppCheckToken).not.toHaveBeenCalled();
    });

    it('本番環境では有効なトークンでハンドラーを実行する', async () => {
      mockVerifyAppCheckToken.mockResolvedValue(true);
      const wrappedHandler = withAppCheck(mockHandler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      await wrappedHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(request);
      expect(mockVerifyAppCheckToken).toHaveBeenCalledWith('valid-token');
    });

    it('本番環境では無効なトークンでエラーレスポンスを返す', async () => {
      mockVerifyAppCheckToken.mockResolvedValue(false);
      const wrappedHandler = withAppCheck(mockHandler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      const response = await wrappedHandler(request);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });
});
