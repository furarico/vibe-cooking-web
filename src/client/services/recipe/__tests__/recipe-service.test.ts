import { RecipeService } from '../recipe-service';
import { IRecipeRepository } from '@/client/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api-client';

// IRecipeRepositoryのモック
const mockRecipeRepository: jest.Mocked<IRecipeRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(() => {
    service = new RecipeService(mockRecipeRepository);
    jest.clearAllMocks();
  });

  const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
    id: '1',
    title: 'テストレシピ',
    description: 'テスト説明',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    ingredients: [],
    instructions: [],
    tags: ['テスト'],
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe('getAllRecipes', () => {
    it('リポジトリからレシピ一覧を取得して返すこと', async () => {
      // Arrange
      const mockRecipes: Recipe[] = [
        createMockRecipe({ id: '1', title: 'レシピ1' }),
        createMockRecipe({ id: '2', title: 'レシピ2' }),
      ];
      mockRecipeRepository.findAll.mockResolvedValue(mockRecipes);

      // Act
      const result = await service.getAllRecipes();

      // Assert
      expect(mockRecipeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRecipes);
    });

    it('リポジトリでエラーが発生した場合、エラーをそのまま伝播すること', async () => {
      // Arrange
      const mockError = new Error('Repository Error');
      mockRecipeRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getAllRecipes()).rejects.toThrow('Repository Error');
      expect(mockRecipeRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRecipeById', () => {
    it('リポジトリから指定IDのレシピを取得して返すこと', async () => {
      // Arrange
      const mockRecipe = createMockRecipe({ id: '123' });
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);

      // Act
      const result = await service.getRecipeById('123');

      // Assert
      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockRecipe);
    });

    it('レシピが見つからない場合、nullを返すこと', async () => {
      // Arrange
      mockRecipeRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.getRecipeById('999');

      // Assert
      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('リポジトリでエラーが発生した場合、エラーをそのまま伝播すること', async () => {
      // Arrange
      const mockError = new Error('Repository Error');
      mockRecipeRepository.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getRecipeById('123')).rejects.toThrow(
        'Repository Error'
      );
      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('123');
    });
  });
});
