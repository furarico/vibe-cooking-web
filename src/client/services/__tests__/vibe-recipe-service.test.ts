import { IVibeRecipeRepository } from '@/client/repositories/interfaces/i-vibe-recipe-repository';
import { VibeRecipeService } from '@/client/services/vibe-recipe-service';
import { VibeRecipe } from '@/lib/api-client';

// IVibeRecipeRepositoryのモック
const mockVibeRecipeRepository: jest.Mocked<IVibeRecipeRepository> = {
  create: jest.fn(),
};

describe('VibeRecipeService', () => {
  let service: VibeRecipeService;

  beforeEach(() => {
    service = new VibeRecipeService(mockVibeRecipeRepository);
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

  describe('createVibeRecipe', () => {
    it('リポジトリにレシピIDsを渡してバイブレシピを作成すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2'];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
      });
      mockVibeRecipeRepository.create.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await service.createVibeRecipe(recipeIds);

      // Assert
      expect(mockVibeRecipeRepository.create).toHaveBeenCalledTimes(1);
      expect(mockVibeRecipeRepository.create).toHaveBeenCalledWith(recipeIds);
      expect(result).toEqual(mockVibeRecipe);
    });

    it('空のレシピIDsでも正常に処理すること', async () => {
      // Arrange
      const recipeIds: string[] = [];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
        vibeInstructions: [],
      });
      mockVibeRecipeRepository.create.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await service.createVibeRecipe(recipeIds);

      // Assert
      expect(mockVibeRecipeRepository.create).toHaveBeenCalledWith(recipeIds);
      expect(result).toEqual(mockVibeRecipe);
    });

    it('リポジトリでエラーが発生した場合はエラーをそのまま伝播すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2'];
      const errorMessage = 'Repository error';
      mockVibeRecipeRepository.create.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(service.createVibeRecipe(recipeIds)).rejects.toThrow(
        errorMessage
      );
      expect(mockVibeRecipeRepository.create).toHaveBeenCalledWith(recipeIds);
    });

    it('複数のレシピIDsでバイブレシピを作成すること', async () => {
      // Arrange
      const recipeIds = ['recipe1', 'recipe2', 'recipe3', 'recipe4'];
      const mockVibeRecipe = createMockVibeRecipe({
        recipeIds,
        vibeInstructions: [
          { instructionId: 'inst1', step: 1, recipeId: 'recipe1' },
          { instructionId: 'inst2', step: 2, recipeId: 'recipe2' },
          { instructionId: 'inst3', step: 3, recipeId: 'recipe3' },
          { instructionId: 'inst4', step: 4, recipeId: 'recipe4' },
        ],
      });
      mockVibeRecipeRepository.create.mockResolvedValue(mockVibeRecipe);

      // Act
      const result = await service.createVibeRecipe(recipeIds);

      // Assert
      expect(result.recipeIds).toHaveLength(4);
      expect(result.vibeInstructions).toHaveLength(4);
      expect(result).toEqual(mockVibeRecipe);
    });
  });
});
