import {
  IRecipeRepository,
  RecipeListFilters,
} from '@/client/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api-client';
import { RecipeListService } from '../recipe-list-service';

describe('RecipeListService', () => {
  let recipeListService: RecipeListService;
  let mockRecipeRepository: jest.Mocked<IRecipeRepository>;

  beforeEach(() => {
    mockRecipeRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findWithFilters: jest.fn(),
    };
    recipeListService = new RecipeListService(mockRecipeRepository);
  });

  describe('getRecipes', () => {
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

    it('フィルターなしでレシピを取得できる', async () => {
      mockRecipeRepository.findWithFilters.mockResolvedValue(mockRecipes);

      const result = await recipeListService.getRecipes();

      expect(mockRecipeRepository.findWithFilters).toHaveBeenCalledWith(
        undefined
      );
      expect(result).toEqual(mockRecipes);
    });

    it('フィルター付きでレシピを取得できる', async () => {
      const filters: RecipeListFilters = {
        q: 'パスタ',
        tag: 'イタリアン',
        category: 'メイン',
      };
      const filteredRecipes = [mockRecipes[0]];
      mockRecipeRepository.findWithFilters.mockResolvedValue(filteredRecipes);

      const result = await recipeListService.getRecipes(filters);

      expect(mockRecipeRepository.findWithFilters).toHaveBeenCalledWith(
        filters
      );
      expect(result).toEqual(filteredRecipes);
    });

    it('リポジトリエラーをそのまま伝播する', async () => {
      const error = new Error('Repository error');
      mockRecipeRepository.findWithFilters.mockRejectedValue(error);

      await expect(recipeListService.getRecipes()).rejects.toThrow(
        'Repository error'
      );
    });
  });
});
