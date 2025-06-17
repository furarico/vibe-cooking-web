import { PrismaClient } from '@prisma/client';
import { VibeRecipeRepository } from '../vibe-recipe-repository';

// Prismaクライアントのモック
const mockPrisma = {
  vibeRecipe: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  instruction: {
    findMany: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

describe('VibeRecipeRepository', () => {
  let vibeRecipeRepository: VibeRecipeRepository;

  beforeEach(() => {
    vibeRecipeRepository = new VibeRecipeRepository(mockPrisma);
    jest.clearAllMocks();
  });

  describe('findByRecipeIds', () => {
    it('完全に一致するrecipeIdsを持つVibeRecipeを返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const vibeRecipes = [
        {
          id: 'vibe1',
          recipeIds: ['recipe1', 'recipe2'],
          vibeInstructions: [],
        },
        {
          id: 'vibe2',
          recipeIds: ['recipe3', 'recipe4'],
          vibeInstructions: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.vibeRecipe.findMany.mockResolvedValue(vibeRecipes as any);

      const result = await vibeRecipeRepository.findByRecipeIds(recipeIds);

      expect(result).toEqual(vibeRecipes[0]);
      expect(mockPrisma.vibeRecipe.findMany).toHaveBeenCalledWith({
        include: {
          vibeInstructions: true,
        },
      });
    });

    it('順序が異なるが同じrecipeIdsを持つVibeRecipeを返すべき', async () => {
      const recipeIds = ['recipe2', 'recipe1'];
      const vibeRecipes = [
        {
          id: 'vibe1',
          recipeIds: ['recipe1', 'recipe2'],
          vibeInstructions: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.vibeRecipe.findMany.mockResolvedValue(vibeRecipes as any);

      const result = await vibeRecipeRepository.findByRecipeIds(recipeIds);

      expect(result).toEqual(vibeRecipes[0]);
    });

    it('一致するVibeRecipeが見つからない場合、nullを返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const vibeRecipes = [
        {
          id: 'vibe1',
          recipeIds: ['recipe3', 'recipe4'],
          vibeInstructions: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.vibeRecipe.findMany.mockResolvedValue(vibeRecipes as any);

      const result = await vibeRecipeRepository.findByRecipeIds(recipeIds);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('新しいVibeRecipeを作成して返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const instructions = [
        { instructionId: 'inst1', step: 1 },
        { instructionId: 'inst2', step: 2 },
      ];

      const createdVibeRecipe = {
        id: 'new-vibe-recipe',
        recipeIds,
        vibeInstructions: instructions.map(inst => ({
          id: `vi-${inst.step}`,
          instructionId: inst.instructionId,
          step: inst.step,
          vibeRecipeId: 'new-vibe-recipe',
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.vibeRecipe.create.mockResolvedValue(createdVibeRecipe as any);

      const result = await vibeRecipeRepository.create(recipeIds, instructions);

      expect(result).toEqual(createdVibeRecipe);
      expect(mockPrisma.vibeRecipe.create).toHaveBeenCalledWith({
        data: {
          recipeIds,
          vibeInstructions: {
            create: instructions.map(({ instructionId, step }) => ({
              instructionId,
              step,
            })),
          },
        },
        include: {
          vibeInstructions: true,
        },
      });
    });
  });

  describe('getInstructionsByRecipeIds', () => {
    it('指定されたrecipeIdsに紐づくInstructionsを返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const instructions = [
        { id: 'inst1', description: '材料を切る' },
        { id: 'inst2', description: 'フライパンを温める' },
        { id: 'inst3', description: '調味料を加える' },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.instruction.findMany.mockResolvedValue(instructions as any);

      const result =
        await vibeRecipeRepository.getInstructionsByRecipeIds(recipeIds);

      expect(result).toEqual(instructions);
      expect(mockPrisma.instruction.findMany).toHaveBeenCalledWith({
        where: {
          recipeId: {
            in: recipeIds,
          },
        },
        select: {
          id: true,
          description: true,
        },
      });
    });

    it('該当するInstructionがない場合、空配列を返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];

      mockPrisma.instruction.findMany.mockResolvedValue([]);

      const result =
        await vibeRecipeRepository.getInstructionsByRecipeIds(recipeIds);

      expect(result).toEqual([]);
    });
  });
});
