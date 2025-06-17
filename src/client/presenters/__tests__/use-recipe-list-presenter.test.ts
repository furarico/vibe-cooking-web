import { useRecipeListPresenter } from '@/client/presenters/use-recipe-list-presenter';
import { RecipeListService } from '@/client/services/recipe-list-service';
import { renderHook } from '@testing-library/react';

jest.mock('@/client/di/providers', () => ({
  useDI: () => ({
    recipeListService: mockRecipeListService,
    vibeCookingService: mockVibeCookingService,
  }),
}));

const mockRecipeListService = {
  getRecipes: jest.fn(),
} as jest.Mocked<RecipeListService>;

const mockVibeCookingService = {
  getVibeCookingRecipeIds: jest.fn(),
  addVibeCookingRecipeId: jest.fn(),
  removeVibeCookingRecipeId: jest.fn(),
};

describe('useRecipeListPresenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVibeCookingService.getVibeCookingRecipeIds.mockReturnValue([]);
  });

  it('presenterが初期化される', () => {
    const { result } = renderHook(() => useRecipeListPresenter());

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
  });

  it('recipeListServiceが呼び出される', () => {
    renderHook(() => useRecipeListPresenter());

    // recipeListServiceのgetRecipesが呼び出されることを確認
    expect(mockRecipeListService.getRecipes).toHaveBeenCalled();
  });

  it('初期フィルターが設定される', () => {
    const initialFilters = { q: 'パスタ' };
    const { result } = renderHook(() => useRecipeListPresenter(initialFilters));

    expect(result.current.state.filters).toEqual(initialFilters);
  });
});
