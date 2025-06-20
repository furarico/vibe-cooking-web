import { PrismaClient } from '@prisma/client';
import { RecipeRepository } from '../recipe-repository';

// Prismaクライアントのモック
const mockPrismaClient = {
  recipe: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

describe('RecipeRepository', () => {
  let recipeRepository: RecipeRepository;

  beforeEach(() => {
    recipeRepository = new RecipeRepository(mockPrismaClient);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('全てのレシピを取得できること', async () => {
      const mockRecipes = [
        {
          id: '1',
          title: 'テストレシピ1',
          description: 'テスト説明1',
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          imageUrl: null,
          tags: ['和食'],
          createdAt: new Date(),
          updatedAt: new Date(),
          ingredients: [],
          instructions: [],
        },
      ];

      (mockPrismaClient.recipe.findMany as jest.Mock).mockResolvedValue(
        mockRecipes
      );

      const result = await recipeRepository.findAll();

      expect(result).toEqual(mockRecipes);
      expect(mockPrismaClient.recipe.findMany).toHaveBeenCalledWith({
        include: {
          ingredients: {
            orderBy: { id: 'asc' },
          },
          instructions: {
            orderBy: { step: 'asc' },
          },
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('指定されたIDのレシピを取得できること', async () => {
      const mockRecipe = {
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
        ingredients: [],
        instructions: [],
      };

      (mockPrismaClient.recipe.findUnique as jest.Mock).mockResolvedValue(
        mockRecipe
      );

      const result = await recipeRepository.findById('1');

      expect(result).toEqual(mockRecipe);
      expect(mockPrismaClient.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          ingredients: {
            orderBy: { id: 'asc' },
          },
          instructions: {
            orderBy: { step: 'asc' },
          },
          category: true,
        },
      });
    });

    it('存在しないIDの場合はnullを返すこと', async () => {
      (mockPrismaClient.recipe.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await recipeRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
