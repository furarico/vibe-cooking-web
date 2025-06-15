import { RecipeListFilters } from '@/client/repositories/interfaces/i-recipe-repository';
import { RecipeListService } from '@/client/services/recipe-list-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useRecipeListPresenter } from '../use-recipe-list-presenter';

jest.mock('@/client/di/providers', () => ({
  useDI: () => ({
    recipeListService: mockRecipeListService,
  }),
}));

const mockRecipeListService = {
  getRecipes: jest.fn(),
} as jest.Mocked<RecipeListService>;

describe('useRecipeListPresenter', () => {
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'パスタ',
      description: '美味しいパスタ',
      tags: ['イタリアン'],
      cookTime: 15,
      prepTime: 10,
    },
    {
      id: '2',
      title: 'サラダ',
      description: '新鮮なサラダ',
      tags: ['ヘルシー'],
      cookTime: 0,
      prepTime: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態が正しく設定される', () => {
    mockRecipeListService.getRecipes.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() => useRecipeListPresenter());

    expect(result.current.recipes).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.filters).toEqual({});
  });

  it('初期フィルターで初期化される', () => {
    const initialFilters: RecipeListFilters = { q: 'パスタ' };
    mockRecipeListService.getRecipes.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() => useRecipeListPresenter(initialFilters));

    expect(result.current.filters).toEqual(initialFilters);
  });

  it('レシピ取得が成功する', async () => {
    mockRecipeListService.getRecipes.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() => useRecipeListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(mockRecipes);
    expect(mockRecipeListService.getRecipes).toHaveBeenCalledWith({});
  });

  it('レシピ取得でエラーが発生する', async () => {
    const error = new Error('API Error');
    mockRecipeListService.getRecipes.mockRejectedValue(error);

    const { result } = renderHook(() => useRecipeListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual([]);
  });

  it('フィルター付きでレシピを取得する', async () => {
    const filters: RecipeListFilters = { q: 'パスタ', tag: 'イタリアン' };
    const filteredRecipes = [mockRecipes[0]];
    mockRecipeListService.getRecipes.mockResolvedValue(filteredRecipes);

    const { result } = renderHook(() => useRecipeListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // フィルター付きで再取得
    await act(async () => {
      await result.current.fetchRecipes(filters);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(filteredRecipes);
    expect(result.current.filters).toEqual(filters);
    expect(mockRecipeListService.getRecipes).toHaveBeenCalledWith(filters);
  });

  it('setFiltersでフィルターを更新する', async () => {
    mockRecipeListService.getRecipes.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() => useRecipeListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newFilters: RecipeListFilters = { category: 'メイン' };
    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it('refreshRecipesで現在のフィルターでリフレッシュする', async () => {
    const filters: RecipeListFilters = { q: 'パスタ' };
    mockRecipeListService.getRecipes.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() => useRecipeListPresenter(filters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // リフレッシュ実行
    await act(async () => {
      await result.current.refreshRecipes();
    });

    expect(mockRecipeListService.getRecipes).toHaveBeenCalledWith(filters);
  });
});
