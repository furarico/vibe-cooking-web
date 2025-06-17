import { useRecipesByCategoryPresenter } from '@/client/presenters/use-recipes-by-category-presenter';
import { RecipeService } from '@/client/services/recipe-service';
import { renderHook } from '@testing-library/react';

// React actエラーを抑制（useEffect内の非同期処理のため）
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('An update to TestComponent inside a test was not wrapped in act') ||
       args[0].includes('The current testing environment is not configured to support act'))
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('presenterが初期化される', () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(result.current).toBeDefined();
    expect(result.current.recipes).toEqual([]);
    expect(result.current.fetchRecipesByCategory).toBeDefined();
  });

  it('recipeServiceが指定されたカテゴリIDで呼び出される', () => {
    renderHook(() => useRecipesByCategoryPresenter(categoryId));
    
    // recipeServiceのgetRecipesByCategoryIdが呼び出されることを確認
    expect(mockRecipeService.getRecipesByCategoryId).toHaveBeenCalledWith(categoryId);
  });

  it('fetchRecipesByCategoryメソッドが存在する', () => {
    const { result } = renderHook(() =>
      useRecipesByCategoryPresenter(categoryId)
    );

    expect(typeof result.current.fetchRecipesByCategory).toBe('function');
  });
});
