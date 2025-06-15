import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryService } from '@/client/services/category-service';
import { Category } from '@/lib/api-client';
import { act, renderHook, waitFor } from '@testing-library/react';

jest.mock('@/client/di/providers', () => ({
  useDI: () => ({
    categoryService: mockCategoryService,
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
  });

  it('初期状態が正しく設定される', () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current.categories).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('カテゴリ取得が成功する', async () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(mockCategoryService.getAllCategories).toHaveBeenCalledTimes(1);
  });

  it('カテゴリ取得でエラーが発生した場合トーストエラーが表示される', async () => {
    const error = new Error('API Error');
    mockCategoryService.getAllCategories.mockRejectedValue(error);
    const { toast } = await import('sonner');
    const mockToastError = toast.error;

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(mockToastError).toHaveBeenCalledWith('カテゴリの取得に失敗しました');
  });

  it('fetchCategoriesで手動でカテゴリを再取得できる', async () => {
    mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategoryPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 手動で再取得
    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(mockCategoryService.getAllCategories).toHaveBeenCalledTimes(2);
  });

  it('手動再取得中もローディング状態が適切に管理される', async () => {
    let resolvePromise: (value: Category[]) => void;
    const promise = new Promise<Category[]>(resolve => {
      resolvePromise = resolve;
    });
    mockCategoryService.getAllCategories.mockReturnValue(promise);

    const { result } = renderHook(() => useCategoryPresenter());

    expect(result.current.loading).toBe(true);

    // プロミスを解決
    act(() => {
      resolvePromise!(mockCategories);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
  });
});
