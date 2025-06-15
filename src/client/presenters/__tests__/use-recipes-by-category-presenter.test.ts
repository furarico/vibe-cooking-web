import { useRecipesByCategoryPresenter } from '@/client/presenters/use-recipes-by-category-presenter';
import { RecipeService } from '@/client/services/recipe-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook, waitFor } from '@testing-library/react';

// React actエラーを抑制
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes(
        'Warning: An update to TestComponent inside a test was not wrapped in act'
      )
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
} as jest.Mocked<RecipeService>;

describe('useRecipesByCategoryPresenter', () => {
  const categoryId = 'category-1';
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'パスタ',
      description: '美味しいパスタ',
      tags: ['イタリアン'],
      cookTime: 15,
      prepTime: 10,
      categoryId: categoryId,
    },
    {
      id: '2',
      title: 'リゾット',
      description: 'クリーミーなリゾット',
      tags: ['イタリアン'],
      cookTime: 20,
      prepTime: 5,
      categoryId: categoryId,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態が正しく設定される', () => {
    mockRecipeService.getRecipesByCategoryId.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(result.current.recipes).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('指定されたカテゴリIDでレシピ取得が成功する', async () => {
    mockRecipeService.getRecipesByCategoryId.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    // 非同期的にローディングが完了するまで待機
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(mockRecipes);
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(
      categoryId
    );
  });

  it('レシピ取得でエラーが発生した場合トーストエラーが表示される', async () => {
    const error = new Error('API Error');
    mockRecipeService.getRecipesByCategoryId.mockRejectedValue(error);
    const { toast } = await import('sonner');
    const mockToastError = toast.error;

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual([]);
    expect(mockToastError).toHaveBeenCalledWith('レシピの取得に失敗しました');
  });

  it('fetchRecipesByCategoryで手動でレシピを再取得できる', async () => {
    mockRecipeService.getRecipesByCategoryId.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 手動で再取得
    const newCategoryId = 'category-2';
    await act(async () => {
      await result.current.fetchRecipesByCategory(newCategoryId);
    });

    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(
      newCategoryId
    );
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledTimes(2);
  });

  it('手動再取得中に正しくローディング状態が管理される', async () => {
    let resolvePromise: (value: Recipe[]) => void;
    const promise = new Promise<Recipe[]>(resolve => {
      resolvePromise = resolve;
    });
    mockRecipeService.getRecipesByCategoryId.mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(result.current.loading).toBe(true);

    // プロミスを解決
    resolvePromise!(mockRecipes);

    await act(async () => {
      await promise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(mockRecipes);
  });

  it('categoryIdが変更された場合は手動でfetchRecipesByCategoryを呼び出す必要がある', async () => {
    mockRecipeService.getRecipesByCategoryId.mockResolvedValue(mockRecipes);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter('category-1')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(
      'category-1'
    );
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledTimes(1);

    // 新しいcategoryIdで手動取得
    await act(async () => {
      await result.current.fetchRecipesByCategory('category-2');
    });

    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(
      'category-2'
    );
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledTimes(2);
  });

  it('レシピ取得中にレシピ配列がクリアされる', async () => {
    // 最初のレシピ取得
    mockRecipeService.getRecipesByCategoryId.mockResolvedValueOnce(mockRecipes);

    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recipes).toEqual(mockRecipes);

    // 再取得時にプロミスが保留状態になるようにモック
    let resolveSecondPromise: (value: Recipe[]) => void;
    const secondPromise = new Promise<Recipe[]>(resolve => {
      resolveSecondPromise = resolve;
    });
    mockRecipeService.getRecipesByCategoryId.mockReturnValue(secondPromise);

    // 手動で再取得を開始
    act(() => {
      result.current.fetchRecipesByCategory('category-2');
    });

    // ローディング中にレシピがクリアされることを確認
    expect(result.current.loading).toBe(true);
    expect(result.current.recipes).toEqual([]);

    // プロミスを解決
    resolveSecondPromise!(mockRecipes);

    await act(async () => {
      await secondPromise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
