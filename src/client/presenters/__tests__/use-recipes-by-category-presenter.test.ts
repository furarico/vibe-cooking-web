import { useRecipesByCategoryPresenter } from '@/client/presenters/use-recipes-by-category-presenter';
import { RecipeService } from '@/client/services/recipe-service';
import { Recipe } from '@/lib/api-client';
import { renderHook, waitFor } from '@testing-library/react';

// React actエラーを抑制（useEffect内の非同期処理のため）
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes(
        'An update to TestComponent inside a test was not wrapped in act'
      ) ||
        args[0].includes(
          'The current testing environment is not configured to support act'
        ))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

jest.mock('@/client/di/providers', () => ({
  useDI: () => ({
    recipeService: mockRecipeService,
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockRecipeService = {
  getRecipesByCategoryId: jest.fn(),
  getRecipeById: jest.fn(),
  getAllRecipes: jest.fn(),
} as jest.Mocked<RecipeService>;

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'レシピ1',
    description: 'テスト用レシピ1',
    instructions: [],
  },
  {
    id: '2',
    title: 'レシピ2',
    description: 'テスト用レシピ2',
    instructions: [],
  },
];

describe('useRecipesByCategoryPresenter', () => {
  const categoryId = 'category-1';

  beforeEach(() => {
    jest.clearAllMocks();
    mockRecipeService.getRecipesByCategoryId.mockResolvedValue(mockRecipes);
  });

  it('presenterが初期化される', async () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(result.current).toBeDefined();
    expect(result.current.recipes).toEqual([]);
    expect(result.current.fetchRecipesByCategory).toBeDefined();

    // useEffect内の非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('recipeServiceが指定されたカテゴリIDで呼び出される', async () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    // useEffect内の非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // recipeServiceのgetRecipesByCategoryIdが呼び出されることを確認
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(
      categoryId
    );
  });

  it('fetchRecipesByCategoryメソッドが存在する', async () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(typeof result.current.fetchRecipesByCategory).toBe('function');

    // useEffect内の非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('レシピが正常に取得されることを確認', async () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    // useEffect内の非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(mockRecipes);
  });

  it('レシピ取得エラー時の処理を確認', async () => {
    mockRecipeService.getRecipesByCategoryId.mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    // useEffect内の非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual([]);
  });
});
