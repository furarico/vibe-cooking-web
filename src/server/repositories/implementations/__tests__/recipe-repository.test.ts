import { PrismaClient } from '@prisma/client';
import { RecipeRepository } from '../recipe-repository';
import { CreateRecipeInput } from '../../interfaces/i-recipe-repository';

// Prismaクライアントのモック
const mockPrismaClient = {
  recipe: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  ingredient: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  instruction: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  $transaction: jest.fn(),
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
        },
      });
    });

    it('存在しないIDの場合はnullを返すこと', async () => {
      (mockPrismaClient.recipe.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await recipeRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('新しいレシピを作成できること', async () => {
      const createInput: CreateRecipeInput = {
        title: '新しいレシピ',
        description: '新しい説明',
        prepTime: 15,
        cookTime: 30,
        servings: 2,
        imageUrl: 'https://example.com/image.jpg',
        tags: ['洋食', 'パスタ'],
        ingredients: [
          {
            name: 'パスタ',
            amount: 200,
            unit: 'g',
            notes: '乾麺',
          },
        ],
        instructions: [
          {
            step: 1,
            description: 'パスタを茹でる',
            imageUrl: null,
            estimatedTime: 10,
          },
        ],
      };

      const mockCreatedRecipe = {
        id: '1',
        title: '新しいレシピ',
        description: '新しい説明',
        prepTime: 15,
        cookTime: 30,
        servings: 2,
        imageUrl: 'https://example.com/image.jpg',
        tags: ['洋食', 'パスタ'],
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            id: '1',
            name: 'パスタ',
            amount: 200,
            unit: 'g',
            notes: '乾麺',
            recipeId: '1',
          },
        ],
        instructions: [
          {
            id: '1',
            step: 1,
            description: 'パスタを茹でる',
            imageUrl: null,
            estimatedTime: 10,
            recipeId: '1',
          },
        ],
      };

      (mockPrismaClient.recipe.create as jest.Mock).mockResolvedValue(
        mockCreatedRecipe
      );

      const result = await recipeRepository.create(createInput);

      expect(result).toEqual(mockCreatedRecipe);
      expect(mockPrismaClient.recipe.create).toHaveBeenCalledWith({
        data: {
          title: '新しいレシピ',
          description: '新しい説明',
          prepTime: 15,
          cookTime: 30,
          servings: 2,
          imageUrl: 'https://example.com/image.jpg',
          tags: ['洋食', 'パスタ'],
          ingredients: {
            create: createInput.ingredients,
          },
          instructions: {
            create: createInput.instructions,
          },
        },
        include: {
          ingredients: {
            orderBy: { id: 'asc' },
          },
          instructions: {
            orderBy: { step: 'asc' },
          },
        },
      });
    });
  });

  describe('delete', () => {
    it('指定されたIDのレシピを削除できること', async () => {
      (mockPrismaClient.recipe.delete as jest.Mock).mockResolvedValue({});

      await recipeRepository.delete('1');

      expect(mockPrismaClient.recipe.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
