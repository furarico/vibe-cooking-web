import { useDI } from '@/client/di/providers';
import { useRecipeDetailPresenter } from '@/client/presenters/use-recipe-detail-presenter';
import { RecipeService } from '@/client/services/recipe-service';
import { VibeCookingService } from '@/client/services/vibe-cooking-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook } from '@testing-library/react';

// DIプロバイダーをモック
jest.mock('@/client/di/providers');

// モックされたレシピサービス
const mockRecipeService = jest.createMockFromModule<RecipeService>(
  '@/client/services/recipe-service'
) as jest.Mocked<RecipeService>;
mockRecipeService.getAllRecipes = jest.fn<Promise<Recipe[]>, []>();
mockRecipeService.getRecipeById = jest.fn<Promise<Recipe | null>, [string]>();

// モックされたVibeCookingService
const mockVibeCookingService = jest.createMockFromModule<VibeCookingService>(
  '@/client/services/vibe-cooking-service'
) as jest.Mocked<VibeCookingService>;
mockVibeCookingService.getVibeCookingRecipeIds = jest.fn<string[], []>();
mockVibeCookingService.addVibeCookingRecipeId = jest.fn<void, [string]>();
mockVibeCookingService.removeVibeCookingRecipeId = jest.fn<void, [string]>();

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
      recipeService: mockRecipeService,
      vibeCookingService: mockVibeCookingService,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // デフォルトのモック実装
    mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
    mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue([]);
  });

  describe('初期状態', () => {
    it('正しい初期状態を持つべき', () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      expect(result.current.state.recipe).toBeNull();
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.currentStep).toBe(0);
      expect(result.current.state.isCompleted).toBe(false);
      expect(result.current.state.recipeId).toBeNull();
      expect(result.current.state.vibeCookingRecipeIds).toEqual([]);
    });
  });

  describe('setRecipeId', () => {
    it('レシピIDを設定できるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      await act(async () => {
        result.current.actions.setRecipeId('1');
      });

      expect(result.current.state.recipeId).toBe('1');
    });

    it('レシピIDを設定したときにレシピを取得するべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      await act(async () => {
        result.current.actions.setRecipeId('1');
      });

      // Wait for useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockRecipeService.getRecipeById).toHaveBeenCalledWith('1');
      expect(result.current.state.recipe).toEqual(mockRecipe);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.currentStep).toBe(0);
      expect(result.current.state.isCompleted).toBe(false);
    });
  });

  describe('onAddToVibeCookingListButtonTapped', () => {
    it('Vibe Cooking リストに追加できるべき', async () => {
      const { result } = renderHook(() => useRecipeDetailPresenter());

      // レシピIDを設定
      await act(async () => {
        result.current.actions.setRecipeId('1');
      });

      // Wait for recipe to be loaded
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Vibe Cooking リストに追加
      act(() => {
        result.current.actions.onAddToVibeCookingListButtonTapped();
      });

      expect(
        mockVibeCookingService.addVibeCookingRecipeId
      ).toHaveBeenCalledWith('1');
    });

    it('すでにリストに追加されている場合は削除するべき', async () => {
      // モックでリストに既に追加されている状態を設定
      mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue(['1']);

      const { result } = renderHook(() => useRecipeDetailPresenter());

      // レシピIDを設定
      await act(async () => {
        result.current.actions.setRecipeId('1');
      });

      // Wait for recipe to be loaded
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Vibe Cooking リストから削除
      act(() => {
        result.current.actions.onAddToVibeCookingListButtonTapped();
      });

      expect(
        mockVibeCookingService.removeVibeCookingRecipeId
      ).toHaveBeenCalledWith('1');
    });

    it('リストが上限に達している場合はエラーを表示するべき', async () => {
      // モックでリストが上限に達している状態を設定
      mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue([
        '1',
        '2',
        '3',
      ]);

      const { result } = renderHook(() => useRecipeDetailPresenter());

      // レシピIDを設定
      await act(async () => {
        result.current.actions.setRecipeId('4');
      });

      // Wait for recipe to be loaded
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Vibe Cooking リストに追加しようとする
      act(() => {
        result.current.actions.onAddToVibeCookingListButtonTapped();
      });

      // 追加されないことを確認
      expect(
        mockVibeCookingService.addVibeCookingRecipeId
      ).not.toHaveBeenCalled();
    });
  });
});
