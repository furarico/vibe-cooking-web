import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryService } from '@/client/services/category-service';
import { renderHook } from '@testing-library/react';

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
    categoryService: mockCategoryService,
    vibeCookingService: mockVibeCookingService,
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockCategoryService = {
  getAllCategories: jest.fn(),
} as jest.Mocked<CategoryService>;

const mockVibeCookingService = {
  getVibeCookingRecipeIds: jest.fn(),
  addVibeCookingRecipeId: jest.fn(),
  removeVibeCookingRecipeId: jest.fn(),
};

describe('useCategoryPresenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue([]);
  });

  it('presenterが初期化される', () => {
    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
  });

  it('categoryServiceが呼び出される', () => {
    renderHook(() => useCategoryPresenter());

    // categoryServiceのgetAllCategoriesが呼び出されることを確認
    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
  });
});
