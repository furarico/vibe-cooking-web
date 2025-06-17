import { VibeRecipe } from '@prisma/client';
import { GeminiClient } from '../../../lib/gemini-client';
import { IVibeRecipeRepository } from '../../repositories/interfaces/i-vibe-recipe-repository';
import { VibeRecipeService } from '../vibe-recipe-service';

// モック型定義
const mockVibeRecipeRepository: jest.Mocked<IVibeRecipeRepository> = {
  findByRecipeIds: jest.fn(),
  create: jest.fn(),
  getInstructionsByRecipeIds: jest.fn(),
};

const mockGeminiClient: jest.Mocked<GeminiClient> = {
  generateOrderedInstructions: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('VibeRecipeService', () => {
  let vibeRecipeService: VibeRecipeService;

  beforeEach(() => {
    vibeRecipeService = new VibeRecipeService(
      mockVibeRecipeRepository,
      mockGeminiClient
    );
    jest.clearAllMocks();
  });

  describe('createOrGetVibeRecipe', () => {
    const recipeIds = ['recipe1', 'recipe2'];

    it('既存のVibeRecipeがある場合、それを返すべき', async () => {
      const existingVibeRecipe: VibeRecipe = {
        id: 'existing-vibe-recipe',
        recipeIds,
        createdAt: new Date(),
        updatedAt: new Date(),
        vibeInstructions: [
          {
            id: 'vi1',
            instructionId: 'inst1',
            step: 1,
            vibeRecipeId: 'existing-vibe-recipe',
          },
          {
            id: 'vi2',
            instructionId: 'inst2',
            step: 2,
            vibeRecipeId: 'existing-vibe-recipe',
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      mockVibeRecipeRepository.findByRecipeIds.mockResolvedValue(
        existingVibeRecipe
      );

      const result = await vibeRecipeService.createOrGetVibeRecipe(recipeIds);

      expect(result.vibeRecipe).toBe(existingVibeRecipe);
      expect(result.isNewlyCreated).toBe(false);
      expect(mockVibeRecipeRepository.findByRecipeIds).toHaveBeenCalledWith(
        recipeIds
      );
      expect(
        mockVibeRecipeRepository.getInstructionsByRecipeIds
      ).not.toHaveBeenCalled();
      expect(
        mockGeminiClient.generateOrderedInstructions
      ).not.toHaveBeenCalled();
    });

    it('既存のVibeRecipeがない場合、新規作成すべき', async () => {
      const instructions = [
        { id: 'inst1', description: '材料を切る' },
        { id: 'inst2', description: 'フライパンを温める' },
      ];

      const geminiResponse = {
        instructions: [
          { instructionId: 'inst2', step: 1 },
          { instructionId: 'inst1', step: 2 },
        ],
      };

      const newVibeRecipe: VibeRecipe = {
        id: 'new-vibe-recipe',
        recipeIds,
        createdAt: new Date(),
        updatedAt: new Date(),
        vibeInstructions: [
          {
            id: 'vi1',
            instructionId: 'inst2',
            step: 1,
            vibeRecipeId: 'new-vibe-recipe',
          },
          {
            id: 'vi2',
            instructionId: 'inst1',
            step: 2,
            vibeRecipeId: 'new-vibe-recipe',
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      mockVibeRecipeRepository.findByRecipeIds.mockResolvedValue(null);
      mockVibeRecipeRepository.getInstructionsByRecipeIds.mockResolvedValue(
        instructions
      );
      mockGeminiClient.generateOrderedInstructions.mockResolvedValue(
        geminiResponse
      );
      mockVibeRecipeRepository.create.mockResolvedValue(newVibeRecipe);

      const result = await vibeRecipeService.createOrGetVibeRecipe(recipeIds);

      expect(result.vibeRecipe).toBe(newVibeRecipe);
      expect(result.isNewlyCreated).toBe(true);
      expect(mockVibeRecipeRepository.findByRecipeIds).toHaveBeenCalledWith(
        recipeIds
      );
      expect(
        mockVibeRecipeRepository.getInstructionsByRecipeIds
      ).toHaveBeenCalledWith(recipeIds);
      expect(mockGeminiClient.generateOrderedInstructions).toHaveBeenCalledWith(
        recipeIds,
        instructions
      );
      expect(mockVibeRecipeRepository.create).toHaveBeenCalledWith(
        recipeIds,
        geminiResponse.instructions
      );
    });

    it('指定されたレシピIDに対応するInstructionが見つからない場合、エラーを投げるべき', async () => {
      mockVibeRecipeRepository.findByRecipeIds.mockResolvedValue(null);
      mockVibeRecipeRepository.getInstructionsByRecipeIds.mockResolvedValue([]);

      await expect(
        vibeRecipeService.createOrGetVibeRecipe(recipeIds)
      ).rejects.toThrow('No instructions found for the provided recipe IDs');

      expect(mockVibeRecipeRepository.findByRecipeIds).toHaveBeenCalledWith(
        recipeIds
      );
      expect(
        mockVibeRecipeRepository.getInstructionsByRecipeIds
      ).toHaveBeenCalledWith(recipeIds);
      expect(
        mockGeminiClient.generateOrderedInstructions
      ).not.toHaveBeenCalled();
      expect(mockVibeRecipeRepository.create).not.toHaveBeenCalled();
    });
  });
});
