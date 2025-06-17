import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryService } from '@/client/services/category-service';
import { Category } from '@/lib/api-client';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/client/di/providers', () => ({
  useDI: () => ({
    categoryService: mockCategoryService,
    savedRecipeService: mockSavedRecipeService,
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

const mockSavedRecipeService = {
  getSavedRecipeIds: jest.fn(),
  saveRecipe: jest.fn(),
  removeRecipe: jest.fn(),
  isRecipeSaved: jest.fn(),
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
    mockSavedRecipeService.getSavedRecipeIds.mockReturnValue([]);
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

  it('保存されたレシピIDが正しく取得される', async () => {
    const savedRecipeIds = ['recipe1', 'recipe2'];
    mockSavedRecipeService.getSavedRecipeIds.mockReturnValue(savedRecipeIds);
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.vibeCookingRecipeIds).toEqual(savedRecipeIds);
    expect(mockSavedRecipeService.getSavedRecipeIds).toHaveBeenCalledTimes(1);
  });

  it('actionsオブジェクトが定義されている', () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current.actions).toBeDefined();
    expect(typeof result.current.actions).toBe('object');
  });
});
