import { PrismaClient } from '@prisma/client';
import { VibeRecipeRepository } from '../vibe-recipe-repository';

// モック関数を個別に定義
const mockVibeRecipeFindMany = jest.fn();
const mockVibeRecipeCreate = jest.fn();
const mockInstructionFindMany = jest.fn();

// Prismaクライアントのモック
const mockPrisma = {
  vibeRecipe: {
    findMany: mockVibeRecipeFindMany,
    create: mockVibeRecipeCreate,
  },
  instruction: {
    findMany: mockInstructionFindMany,
  },
} as unknown as PrismaClient;

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
      mockVibeRecipeFindMany.mockResolvedValue(vibeRecipes as any);

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
      mockVibeRecipeFindMany.mockResolvedValue(vibeRecipes as any);

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
      mockVibeRecipeFindMany.mockResolvedValue(vibeRecipes as any);

      const result = await vibeRecipeRepository.findByRecipeIds(recipeIds);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('新しいVibeRecipeを作成して返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];
      const instructions = [
        { instructionId: 'inst1', step: 1, recipeId: 'recipe1' },
        { instructionId: 'inst2', step: 2, recipeId: 'recipe2' },
      ];

      const createdVibeRecipe = {
        id: 'new-vibe-recipe',
        recipeIds,
        vibeInstructions: instructions.map(inst => ({
          instructionId: inst.instructionId,
          step: inst.step,
          recipeId: inst.recipeId,
          vibeRecipeId: 'new-vibe-recipe',
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockVibeRecipeCreate.mockResolvedValue(createdVibeRecipe as any);

      const result = await vibeRecipeRepository.create(recipeIds, instructions);

      expect(result).toEqual(createdVibeRecipe);
      expect(mockPrisma.vibeRecipe.create).toHaveBeenCalledWith({
        data: {
          recipeIds,
          vibeInstructions: {
            create: instructions.map(({ instructionId, step, recipeId }) => ({
              instructionId,
              step,
              recipeId,
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
        { id: 'inst1', description: '材料を切る', recipeId: 'recipe1' },
        { id: 'inst2', description: 'フライパンを温める', recipeId: 'recipe1' },
        { id: 'inst3', description: '調味料を加える', recipeId: 'recipe2' },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockInstructionFindMany.mockResolvedValue(instructions as any);

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
          recipeId: true,
        },
      });
    });

    it('該当するInstructionがない場合、空配列を返すべき', async () => {
      const recipeIds = ['recipe1', 'recipe2'];

      mockInstructionFindMany.mockResolvedValue([]);

      const result =
        await vibeRecipeRepository.getInstructionsByRecipeIds(recipeIds);

      expect(result).toEqual([]);
    });
  });
});
