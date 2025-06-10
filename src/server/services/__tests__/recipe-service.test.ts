import { RecipeService } from '../recipe-service';
import {
  IRecipeRepository,
  RecipeWithDetails,
} from '../../repositories/interfaces/i-recipe-repository';

// リポジトリのモック
const mockRecipeRepository: jest.Mocked<IRecipeRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe('RecipeService', () => {
  let recipeService: RecipeService;

  beforeEach(() => {
    recipeService = new RecipeService(mockRecipeRepository);
    jest.clearAllMocks();
  });

  const mockRecipe: RecipeWithDetails = {
    id: '1',
    title: 'テストレシピ',
    description: 'テスト説明',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    imageUrl: null,
    tags: ['和食'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ingredients: [
      {
        id: '1',
        name: '米',
        amount: 2,
        unit: '合',
        notes: null,
        recipeId: '1',
      },
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        description: '米を研ぐ',
        imageUrl: null,
        estimatedTime: 5,
        recipeId: '1',
      },
    ],
  };

  describe('getAllRecipes', () => {
    it('全てのレシピを取得できること', async () => {
      const mockRecipes = [mockRecipe];
      mockRecipeRepository.findAll.mockResolvedValue(mockRecipes);

      const result = await recipeService.getAllRecipes();

      expect(result).toEqual(mockRecipes);
      expect(mockRecipeRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRecipeById', () => {
    it('指定されたIDのレシピを取得できること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);

      const result = await recipeService.getRecipeById('1');

      expect(result).toEqual(mockRecipe);
      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('1');
    });

    it('存在しないIDの場合はエラーを投げること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);

      await expect(recipeService.getRecipeById('nonexistent')).rejects.toThrow(
        'Recipe with id nonexistent not found'
      );
    });
  });
});
