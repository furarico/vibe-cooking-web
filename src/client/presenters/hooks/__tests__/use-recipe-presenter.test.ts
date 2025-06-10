import { useDI } from '@/client/di/providers';
import { RecipeService } from '@/client/services/recipe/recipe-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook, RenderHookResult } from '@testing-library/react';
import {
  RecipePresenterActions,
  RecipePresenterState,
  useRecipePresenter,
} from '../use-recipe-presenter';

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
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'テストレシピ1',
    description: 'テスト用のレシピです',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    ingredients: [{ name: '材料1', amount: 100, unit: 'g' }],
    instructions: [{ step: 1, description: '手順1' }],
    tags: ['テスト'],
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'テストレシピ2',
    description: 'もう一つのテスト用レシピ',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    ingredients: [{ name: '材料2', amount: 200, unit: 'g' }],
    instructions: [
      { step: 1, description: '手順1' },
      { step: 2, description: '手順2' },
    ],
    tags: ['テスト2'],
    imageUrl: 'test2.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('useRecipePresenter', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // useDIのモック設定
    mockUseDI.mockReturnValue({
      recipeService: mockRecipeService,
    });

    // デフォルトのモック実装
    mockRecipeService.getAllRecipes.mockResolvedValue(mockRecipes);
  });

  describe('初期状態', () => {
    it('正しい初期状態を持つべき', async () => {
      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化時のuseEffectが完了するまで待機
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.recipes).toEqual(mockRecipes);
      expect(result.current.selectedRecipe).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.showDialog).toBe(false);
    });
  });

  describe('fetchRecipes', () => {
    it('レシピを正常に取得できるべき', async () => {
      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化完了を待つ
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // モックをリセットして手動呼び出しのみをテスト
      jest.clearAllMocks();

      await act(async () => {
        await result.current.fetchRecipes();
      });

      expect(mockRecipeService.getAllRecipes).toHaveBeenCalledTimes(1);
      expect(result.current.recipes).toEqual(mockRecipes);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('レシピ取得中はローディング状態になるべき', async () => {
      // 長時間かかるPromiseを作成
      let resolvePromise: (value: Recipe[]) => void;
      const longRunningPromise = new Promise<Recipe[]>(resolve => {
        resolvePromise = resolve;
      });

      mockRecipeService.getAllRecipes.mockReturnValue(longRunningPromise);

      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化のPromiseを解決して初期ローディングを完了
        resolvePromise!(mockRecipes);
        await longRunningPromise;
      });

      // 新しいPromiseでローディング状態をテスト
      let newResolvePromise: (value: Recipe[]) => void;
      const newLongRunningPromise = new Promise<Recipe[]>(resolve => {
        newResolvePromise = resolve;
      });

      mockRecipeService.getAllRecipes.mockReturnValue(newLongRunningPromise);

      await act(async () => {
        result.current.fetchRecipes();
      });

      // ローディング状態を確認
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();

      // Promise を解決
      await act(async () => {
        newResolvePromise!(mockRecipes);
        await newLongRunningPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('エラー時は適切にエラー状態を設定するべき', async () => {
      const errorMessage = 'ネットワークエラー';
      mockRecipeService.getAllRecipes.mockRejectedValue(
        new Error(errorMessage)
      );

      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化時のエラーを待機
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.recipes).toEqual([]);
    });
  });

  describe('selectRecipe', () => {
    it('レシピを選択してダイアログを表示するべき', async () => {
      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化完了を待つ
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.selectRecipe(mockRecipes[0]);
      });

      expect(result.current.selectedRecipe).toEqual(mockRecipes[0]);
      expect(result.current.showDialog).toBe(true);
    });
  });

  describe('closeDialog', () => {
    it('ダイアログを閉じて選択されたレシピをクリアするべき', async () => {
      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化完了を待つ
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // まずレシピを選択
      act(() => {
        result.current.selectRecipe(mockRecipes[0]);
      });

      // ダイアログを閉じる
      act(() => {
        result.current.closeDialog();
      });

      expect(result.current.selectedRecipe).toBeNull();
      expect(result.current.showDialog).toBe(false);
    });
  });

  describe('refreshRecipes', () => {
    it('レシピを再取得できるべき', async () => {
      let result: RenderHookResult<
        RecipePresenterState & RecipePresenterActions,
        unknown
      >['result'];

      await act(async () => {
        const hookResult = renderHook(() => useRecipePresenter());
        result = hookResult.result;
        // 初期化完了を待つ
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // モックをリセットして手動呼び出しのみをテスト
      jest.clearAllMocks();

      await act(async () => {
        await result.current.refreshRecipes();
      });

      expect(mockRecipeService.getAllRecipes).toHaveBeenCalledTimes(1);
    });
  });
});
