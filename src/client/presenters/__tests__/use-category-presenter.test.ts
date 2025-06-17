import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryService } from '@/client/services/category-service';
import { Category } from '@/lib/api-client';
import { renderHook, waitFor } from '@testing-library/react';

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
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'メイン料理',
    },
    {
      id: '2',
      name: 'デザート',
    },
    {
      id: '3',
      name: 'サイドディッシュ',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue([]);
  });

  it('初期状態が正しく設定される', () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current.state.categories).toEqual([]);
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.vibeCookingRecipeIds).toEqual([]);
  });

  it('カテゴリ取得が成功する', async () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.categories).toEqual(mockCategories);
    expect(mockCategoryService.getAllCategories).toHaveBeenCalledTimes(1);
  });

  it('カテゴリ取得でエラーが発生した場合トーストエラーが表示される', async () => {
    const error = new Error('API Error');
    mockCategoryService.getAllCategories.mockRejectedValue(error);
    const { toast } = await import('sonner');
    const mockToastError = toast.error;

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.categories).toEqual([]);
    expect(mockToastError).toHaveBeenCalledWith('カテゴリの取得に失敗しました');
  });

  it('Vibe CookingレシピIDが正しく取得される', async () => {
    const vibeCookingRecipeIds = ['recipe1', 'recipe2'];
    mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue(
      vibeCookingRecipeIds
    );
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.vibeCookingRecipeIds).toEqual(
      vibeCookingRecipeIds
    );
    expect(
      mockVibeCookingService.getVibeCookingRecipeIds
    ).toHaveBeenCalledTimes(1);
  });

  it('actionsオブジェクトが定義されている', () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current.actions).toBeDefined();
    expect(typeof result.current.actions).toBe('object');
  });
});
