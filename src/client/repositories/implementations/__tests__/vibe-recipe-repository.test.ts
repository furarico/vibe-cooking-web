import { VibeRecipeRepository } from '@/client/repositories/implementations/vibe-recipe-repository';
import { DefaultApi, VibeRecipe } from '@/lib/api-client';

// DefaultApiのモック
const mockApiClient = {
  vibeRecipePost: jest.fn(),
} as jest.Mocked<DefaultApi>;

describe('VibeRecipeRepository', () => {
  let repository: VibeRecipeRepository;

  beforeEach(() => {
    repository = new VibeRecipeRepository(mockApiClient);
    jest.clearAllMocks();
  });

  const createMockVibeRecipe = (
    overrides: Partial<VibeRecipe> = {}
  ): VibeRecipe => ({
    id: 'vr123',
    recipeIds: ['recipe1', 'recipe2'],
    vibeInstructions: [
      { instructionId: 'inst1', step: 1, recipeId: 'recipe1' },
      { instructionId: 'inst2', step: 2, recipeId: 'recipe2' },
    ],
    ...overrides,
  });

  describe('create', () => {
    it('APIクライアントを使ってバイブレシピを作成すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2'];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
      });
      mockApiClient.vibeRecipePost.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await repository.create(recipeIds);

      // Assert
      expect(mockApiClient.vibeRecipePost).toHaveBeenCalledTimes(1);
      expect(mockApiClient.vibeRecipePost).toHaveBeenCalledWith({
        recipeIds,
      });
      expect(result).toEqual(mockVibeRecipe);
    });

    it('空のレシピIDsでも正常に処理すること', async () => {
      // Arrange
      const recipeIds: string[] = [];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
        vibeInstructions: [],
      });
      mockApiClient.vibeRecipePost.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await repository.create(recipeIds);

      // Assert
      expect(mockApiClient.vibeRecipePost).toHaveBeenCalledWith({
        recipeIds,
      });
      expect(result).toEqual(mockVibeRecipe);
    });

    it('APIクライアントでエラーが発生した場合はエラーをそのまま伝播すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2'];
      const errorMessage = 'API error';
      mockApiClient.vibeRecipePost.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.create(recipeIds)).rejects.toThrow(errorMessage);
      expect(mockApiClient.vibeRecipePost).toHaveBeenCalledWith({
        recipeIds,
      });
    });

    it('複数のレシピIDsでバイブレシピを作成すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2', 'recipe3'];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
        vibeInstructions: [
          { instructionId: 'inst1', step: 1, recipeId: 'recipe1' },
          { instructionId: 'inst2', step: 2, recipeId: 'recipe2' },
          { instructionId: 'inst3', step: 3, recipeId: 'recipe3' },
        ],
      });
      mockApiClient.vibeRecipePost.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await repository.create(recipeIds);

      // Assert
      expect(result.recipeIds).toEqual(recipeIds);
      expect(result.vibeInstructions).toHaveLength(3);
      expect(result).toEqual(mockVibeRecipe);
    });

    it('APIレスポンスの形式が正しいこと', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2'];
      const mockVibeRecipe = createMockVibeRecipe();
      mockApiClient.vibeRecipePost.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await repository.create(recipeIds);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('recipeIds');
      expect(result).toHaveProperty('vibeInstructions');
      expect(Array.isArray(result.recipeIds)).toBe(true);
      expect(Array.isArray(result.vibeInstructions)).toBe(true);
    });
  });
});
