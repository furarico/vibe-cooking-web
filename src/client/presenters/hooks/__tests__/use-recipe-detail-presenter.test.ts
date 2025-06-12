import { useDI } from '@/client/di/providers';
import { RecipeService } from '@/client/services/recipe/recipe-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook } from '@testing-library/react';
import { useRecipeDetailPresenter } from '../use-recipe-detail-presenter';

// DIプロバイダーをモック
jest.mock('@/client/di/providers');

// モックされたレシピサービス
const mockRecipeService = jest.createMockFromModule<RecipeService>(
  '@/client/services/recipe/recipe-service'
) as jest.Mocked<RecipeService>;
mockRecipeService.getAllRecipes = jest.fn<Promise<Recipe[]>, []>();
mockRecipeService.getRecipeById = jest.fn<Promise<Recipe | null>, [string]>();

// モックされたuseDI
const mockUseDI = useDI as jest.MockedFunction<typeof useDI>;

// テスト用のレシピデータ
const mockRecipe: Recipe = {
  id: '1',
  title: 'テストレシピ',
  description: 'テスト用のレシピです',
  prepTime: 10,
  cookTime: 20,
  servings: 2,
  ingredients: [
    { name: '材料1', amount: 100, unit: 'g' },
    { name: '材料2', amount: 200, unit: 'ml' },
  ],
  instructions: [
    { step: 1, title: '手順1', description: '材料を準備する' },
    { step: 2, title: '手順2', description: '炒める' },
    { step: 3, title: '手順3', description: '盛り付ける' },
  ],
  tags: ['テスト'],
  imageUrl: 'test.jpg',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

describe('useRecipeDetailPresenter', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // useDIのモック設定
    mockUseDI.mockReturnValue({
      prisma: {} as typeof import('@/lib/database').prisma,
      recipeService: mockRecipeService,
    });

    // デフォルトのモック実装
    mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
  });

  describe('初期状態', () => {
    it('正しい初期状態を持つべき', () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      expect(result.current.recipe).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });
  });

  describe('fetchRecipe', () => {
    it('レシピを正常に取得できるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      expect(mockRecipeService.getRecipeById).toHaveBeenCalledWith('1');
      expect(result.current.recipe).toEqual(mockRecipe);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });

    it('レシピ取得中はローディング状態になるべき', async () => {
      // 長時間かかるPromiseを作成
      let resolvePromise: (value: Recipe) => void;
      const longRunningPromise = new Promise<Recipe>(resolve => {
        resolvePromise = resolve;
      });

      mockRecipeService.getRecipeById.mockReturnValue(longRunningPromise);

      const { result } = renderHook(() => useRecipeDetailPresenter());

      act(() => {
        result.current.fetchRecipe('1');
      });

      // ローディング状態を確認
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();

      // Promise を解決
      await act(async () => {
        resolvePromise!(mockRecipe);
        await longRunningPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('レシピが見つからない場合はエラー状態になるべき', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(null);

      const { result } = renderHook(() => useRecipeDetailPresenter());

      await act(async () => {
        await result.current.fetchRecipe('999');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('レシピが見つかりませんでした');
      expect(result.current.recipe).toBeNull();
    });

    it('エラー時は適切にエラー状態を設定するべき', async () => {
      const errorMessage = 'ネットワークエラー';
      mockRecipeService.getRecipeById.mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useRecipeDetailPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.recipe).toBeNull();
    });
  });

  describe('setCurrentStep', () => {
    it('有効なステップ番号を設定できるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // ステップを設定
      act(() => {
        result.current.setCurrentStep(1);
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);
    });

    it('最大ステップ数を超えた場合は最大値に制限されるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // 最大値を超えるステップを設定
      act(() => {
        result.current.setCurrentStep(10);
      });

      const maxStep = (mockRecipe.instructions?.length || 1) - 1;
      expect(result.current.currentStep).toBe(maxStep);
      expect(result.current.isCompleted).toBe(true);
    });

    it('負の値を設定した場合は0に制限されるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // 負の値を設定
      act(() => {
        result.current.setCurrentStep(-1);
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });

    it('レシピが読み込まれていない場合は何も変更されないべき', () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      const initialState = { ...result.current };

      act(() => {
        result.current.setCurrentStep(1);
      });

      expect(result.current).toEqual(initialState);
    });
  });

  describe('nextStep', () => {
    it('次のステップに進めるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // 次のステップに進む
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);
    });

    it('最後のステップでは完了状態になるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      const maxStep = (mockRecipe.instructions?.length || 1) - 1;

      // 最後のステップまで進む
      act(() => {
        result.current.setCurrentStep(maxStep);
      });

      expect(result.current.currentStep).toBe(maxStep);
      expect(result.current.isCompleted).toBe(true);
    });

    it('最後のステップを超えないべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      const maxStep = (mockRecipe.instructions?.length || 1) - 1;

      // 最後のステップに設定
      act(() => {
        result.current.setCurrentStep(maxStep);
      });

      // さらに次のステップに進もうとする
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(maxStep);
      expect(result.current.isCompleted).toBe(true);
    });
  });

  describe('prevStep', () => {
    it('前のステップに戻れるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // ステップを進める
      act(() => {
        result.current.setCurrentStep(2);
      });

      // 前のステップに戻る
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);
    });

    it('最初のステップより前には戻れないべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // 最初のステップで前のステップに戻ろうとする
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });
  });

  describe('resetProgress', () => {
    it('進行状況をリセットできるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // ステップを進める
      act(() => {
        result.current.setCurrentStep(2);
      });

      // 進行状況をリセット
      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });
  });

  describe('markCompleted', () => {
    it('完了状態に設定できるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // まずレシピを取得
      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      // 完了状態に設定
      act(() => {
        result.current.markCompleted();
      });

      expect(result.current.isCompleted).toBe(true);
    });
  });
});
