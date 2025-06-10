import { RecipeService } from '../recipe-service';
import {
  IRecipeRepository,
  RecipeWithDetails,
  CreateRecipeInput,
  UpdateRecipeInput,
} from '../../repositories/interfaces/i-recipe-repository';

// リポジトリのモック
const mockRecipeRepository: jest.Mocked<IRecipeRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  describe('createRecipe', () => {
    const validCreateInput: CreateRecipeInput = {
      title: '新しいレシピ',
      description: '新しい説明',
      prepTime: 15,
      cookTime: 30,
      servings: 2,
      imageUrl: 'https://example.com/image.jpg',
      tags: ['洋食'],
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

    it('有効なデータでレシピを作成できること', async () => {
      mockRecipeRepository.create.mockResolvedValue(mockRecipe);

      const result = await recipeService.createRecipe(validCreateInput);

      expect(result).toEqual(mockRecipe);
      expect(mockRecipeRepository.create).toHaveBeenCalledWith(
        validCreateInput
      );
    });

    it('タイトルが空の場合はエラーを投げること', async () => {
      const invalidInput = { ...validCreateInput, title: '' };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Recipe title is required'
      );
    });

    it('材料が空の場合はエラーを投げること', async () => {
      const invalidInput = { ...validCreateInput, ingredients: [] };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Recipe must have at least one ingredient'
      );
    });

    it('手順が空の場合はエラーを投げること', async () => {
      const invalidInput = { ...validCreateInput, instructions: [] };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Recipe must have at least one instruction'
      );
    });

    it('材料の名前が空の場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        ingredients: [{ name: '', amount: 200, unit: 'g' }],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Ingredient 1: name is required'
      );
    });

    it('材料の分量が0以下の場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        ingredients: [{ name: 'パスタ', amount: 0, unit: 'g' }],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Ingredient 1: amount must be greater than 0'
      );
    });

    it('材料の単位が空の場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        ingredients: [{ name: 'パスタ', amount: 200, unit: '' }],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Ingredient 1: unit is required'
      );
    });

    it('手順番号が0以下の場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        instructions: [{ step: 0, description: 'テスト' }],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Instruction 1: step must be greater than 0'
      );
    });

    it('手順の説明が空の場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        instructions: [{ step: 1, description: '' }],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Instruction 1: description is required'
      );
    });

    it('手順番号が重複している場合はエラーを投げること', async () => {
      const invalidInput = {
        ...validCreateInput,
        instructions: [
          { step: 1, description: 'テスト1' },
          { step: 1, description: 'テスト2' },
        ],
      };

      await expect(recipeService.createRecipe(invalidInput)).rejects.toThrow(
        'Instruction steps must be unique'
      );
    });
  });

  describe('updateRecipe', () => {
    const validUpdateInput: UpdateRecipeInput = {
      title: '更新されたレシピ',
      description: '更新された説明',
    };

    it('有効なデータでレシピを更新できること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockRecipeRepository.update.mockResolvedValue(mockRecipe);

      const result = await recipeService.updateRecipe('1', validUpdateInput);

      expect(result).toEqual(mockRecipe);
      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRecipeRepository.update).toHaveBeenCalledWith(
        '1',
        validUpdateInput
      );
    });

    it('存在しないレシピを更新しようとした場合はエラーを投げること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);

      await expect(
        recipeService.updateRecipe('nonexistent', validUpdateInput)
      ).rejects.toThrow('Recipe with id nonexistent not found');
    });

    it('タイトルが空文字で更新しようとした場合はエラーを投げること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      const invalidInput = { title: '' };

      await expect(
        recipeService.updateRecipe('1', invalidInput)
      ).rejects.toThrow('Recipe title cannot be empty');
    });
  });

  describe('deleteRecipe', () => {
    it('レシピを削除できること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(mockRecipe);
      mockRecipeRepository.delete.mockResolvedValue();

      await recipeService.deleteRecipe('1');

      expect(mockRecipeRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRecipeRepository.delete).toHaveBeenCalledWith('1');
    });

    it('存在しないレシピを削除しようとした場合はエラーを投げること', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null);

      await expect(recipeService.deleteRecipe('nonexistent')).rejects.toThrow(
        'Recipe with id nonexistent not found'
      );
    });
  });
});

