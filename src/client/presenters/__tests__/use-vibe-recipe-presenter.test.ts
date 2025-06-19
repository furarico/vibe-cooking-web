import { DIContainer, useDI } from '@/client/di/providers';
import {
  useVibeRecipePresenter,
  VibeRecipePresenterActions,
  VibeRecipePresenterState,
} from '@/client/presenters/use-vibe-recipe-presenter';
import { VibeRecipeService } from '@/client/services/vibe-recipe-service';
import { VibeRecipe } from '@/lib/api-client';
import { act, renderHook, RenderHookResult } from '@testing-library/react';
import { toast } from 'sonner';

// DIプロバイダーをモック
jest.mock('@/client/di/providers');

// toastをモック
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// モックされたバイブレシピサービス
const mockVibeRecipeService = jest.createMockFromModule<VibeRecipeService>(
  '@/client/services/vibe-recipe-service'
) as jest.Mocked<VibeRecipeService>;
mockVibeRecipeService.createVibeRecipe = jest.fn<
  Promise<VibeRecipe>,
  [string[]]
>();

// モックされたuseDI
const mockUseDI = useDI as jest.MockedFunction<typeof useDI>;

// テスト用のバイブレシピデータ
const mockVibeRecipe: VibeRecipe = {
  id: 'vr123',
  recipeIds: ['recipe1', 'recipe2'],
  vibeInstructions: [
    { instructionId: 'inst1', step: 1, recipeId: 'recipe1' },
    { instructionId: 'inst2', step: 2, recipeId: 'recipe2' },
  ],
};

describe('useVibeRecipePresenter', () => {
  let hook: RenderHookResult<
    VibeRecipePresenterState & VibeRecipePresenterActions,
    unknown
  >;

  beforeEach(() => {
    // useDIのモックセットアップ
    const mockDIContainer: DIContainer = {
      vibeRecipeService: mockVibeRecipeService,
      audioPlayerService: {} as DIContainer['audioPlayerService'],
      audioRecognitionService: {} as DIContainer['audioRecognitionService'],
      categoryService: {} as DIContainer['categoryService'],
      recipeListService: {} as DIContainer['recipeListService'],
      recipeService: {} as DIContainer['recipeService'],
      vibeCookingService: {} as DIContainer['vibeCookingService'],
    };
    mockUseDI.mockReturnValue(mockDIContainer);

    // フックをレンダリング
    hook = renderHook(() => useVibeRecipePresenter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('初期状態', () => {
    it('正しい初期値を持つ', () => {
      expect(hook.result.current.vibeRecipe).toBeNull();
      expect(hook.result.current.loading).toBe(false);
      expect(hook.result.current.error).toBeNull();
    });
  });

  describe('createVibeRecipe', () => {
    it('正常にバイブレシピを作成する', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      mockVibeRecipeService.createVibeRecipe.mockResolvedValue(mockVibeRecipe);

      await act(async () => {
        await hook.result.current.createVibeRecipe(recipeIds);
      });

      expect(mockVibeRecipeService.createVibeRecipe).toHaveBeenCalledWith(
        recipeIds
      );
      expect(hook.result.current.vibeRecipe).toEqual(mockVibeRecipe);
      expect(hook.result.current.loading).toBe(false);
      expect(hook.result.current.error).toBeNull();
      expect(toast.success).toHaveBeenCalledWith('バイブレシピを作成しました');
    });

    it('レシピIDが空の場合はエラートーストを表示する', async () => {
      await act(async () => {
        await hook.result.current.createVibeRecipe([]);
      });

      expect(mockVibeRecipeService.createVibeRecipe).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('レシピを選択してください');
      expect(hook.result.current.vibeRecipe).toBeNull();
      expect(hook.result.current.loading).toBe(false);
    });

    it('サービスでエラーが発生した場合はエラー状態を設定する', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const errorMessage = 'API error occurred';
      mockVibeRecipeService.createVibeRecipe.mockRejectedValue(
        new Error(errorMessage)
      );

      await act(async () => {
        await hook.result.current.createVibeRecipe(recipeIds);
      });

      expect(hook.result.current.vibeRecipe).toBeNull();
      expect(hook.result.current.loading).toBe(false);
      expect(hook.result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(
        'バイブレシピの作成に失敗しました'
      );
    });

    it('不明なエラーの場合は適切なエラーメッセージを設定する', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      mockVibeRecipeService.createVibeRecipe.mockRejectedValue('unknown error');

      await act(async () => {
        await hook.result.current.createVibeRecipe(recipeIds);
      });

      expect(hook.result.current.error).toBe('不明なエラーが発生しました');
    });
  });

  describe('reset', () => {
    it('状態を初期状態にリセットする', () => {
      // 初期状態でresetを実行
      act(() => {
        hook.result.current.reset();
      });

      expect(hook.result.current.vibeRecipe).toBeNull();
      expect(hook.result.current.loading).toBe(false);
      expect(hook.result.current.error).toBeNull();
    });
  });
});
