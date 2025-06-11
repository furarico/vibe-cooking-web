import * as admin from 'firebase-admin/app';
import * as appCheck from 'firebase-admin/app-check';
import { verifyAppCheckToken } from '../firebase-admin';

// Firebase Admin のモック
jest.mock('firebase-admin/app', () => ({
  getApps: jest.fn(),
  initializeApp: jest.fn(),
  cert: jest.fn(),
}));

jest.mock('firebase-admin/app-check', () => ({
  getAppCheck: jest.fn(),
}));

describe('Firebase Admin', () => {
  const mockGetApps = admin.getApps as jest.MockedFunction<
    typeof admin.getApps
  >;
  const mockInitializeApp = admin.initializeApp as jest.MockedFunction<
    typeof admin.initializeApp
  >;
  const mockGetAppCheck = appCheck.getAppCheck as jest.MockedFunction<
    typeof appCheck.getAppCheck
  >;
  const mockVerifyToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // 環境変数をセット
    process.env.FIREBASE_PRIVATE_KEY = 'mock-private-key';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';
    process.env.FIREBASE_PROJECT_ID = 'test-project';

    // AppCheck モックの設定
    mockGetAppCheck.mockReturnValue({
      verifyToken: mockVerifyToken,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  afterEach(() => {
    // 環境変数をクリア
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PROJECT_ID;
  });

  describe('verifyAppCheckToken', () => {
    it('有効なトークンでtrueを返す', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockGetApps.mockReturnValue([{ name: 'test-app' } as any]);
      mockVerifyToken.mockResolvedValue({ token: 'valid' });

      const result = await verifyAppCheckToken('valid-token');

      expect(result).toBe(true);
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('無効なトークンでfalseを返す', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockGetApps.mockReturnValue([{ name: 'test-app' } as any]);
      mockVerifyToken.mockRejectedValue(new Error('Invalid token'));

      const result = await verifyAppCheckToken('invalid-token');

      expect(result).toBe(false);
    });

    it('Firebase初期化されていない場合に初期化する', async () => {
      mockGetApps.mockReturnValue([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockInitializeApp.mockReturnValue({ name: 'test-app' } as any);
      mockVerifyToken.mockResolvedValue({ token: 'valid' });

      const result = await verifyAppCheckToken('valid-token');

      expect(result).toBe(true);
      expect(mockInitializeApp).toHaveBeenCalled();
    });

    it('必要な環境変数がない場合にfalseを返す', async () => {
      delete process.env.FIREBASE_PRIVATE_KEY;
      mockGetApps.mockReturnValue([]);

      const result = await verifyAppCheckToken('token');

      expect(result).toBe(false);
    });
  });
});
