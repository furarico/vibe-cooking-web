import {
  IRecipeRepository,
  RecipeWithDetails,
  RecipeFilters,
} from '../../repositories/interfaces/i-recipe-repository';
import { RecipeService } from '../recipe-service';

// リポジトリのモック
const mockRecipeRepository: jest.Mocked<IRecipeRepository> = {
  findAll: jest.fn(),
  findAllSummary: jest.fn(),
  findAllSummaryWithFilters: jest.fn(),
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
    categoryId: 'category1',
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
        title: '米を研ぐ',
        description: '米を研ぐ',
        imageUrl: null,
        estimatedTime: 5,
        recipeId: '1',
      },
    ],
  };

  const mockRecipe2: RecipeWithDetails = {
    id: '2',
    title: 'パスタレシピ',
    description: 'パスタの作り方',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    imageUrl: null,
    tags: ['洋食', '簡単'],
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 'category2',
    ingredients: [
      {
        id: '2',
        name: 'パスタ',
        amount: 200,
        unit: 'g',
        notes: null,
        recipeId: '2',
      },
    ],
    instructions: [
      {
        id: '2',
        step: 1,
        title: 'パスタを茹でる',
        description: 'パスタを茹でる',
        imageUrl: null,
        estimatedTime: 10,
        recipeId: '2',
      },
    ],
  };

  describe('getAllRecipes', () => {
    it('全てのレシピを取得できること', async () => {
      const mockSummaryRecipes = [
        {
          ...mockRecipe,
          ingredients: [],
          instructions: [],
        },
      ];
      mockRecipeRepository.findAllSummary.mockResolvedValue(mockSummaryRecipes);

      const result = await recipeService.getAllRecipes();

      expect(result).toEqual(mockSummaryRecipes);
      expect(result[0].ingredients).toEqual([]);
      expect(result[0].instructions).toEqual([]);
      expect(mockRecipeRepository.findAllSummary).toHaveBeenCalledTimes(1);
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

  describe('getAllRecipesWithFilters', () => {
    it('フィルターなしで全てのレシピを取得できること', async () => {
      const mockSummaryRecipes = [
        { ...mockRecipe, ingredients: [], instructions: [] },
        { ...mockRecipe2, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockSummaryRecipes);

      const result = await recipeService.getAllRecipesWithFilters({});

      expect(result).toEqual(mockSummaryRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({});
    });

    it('テキスト検索（q）でレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe2, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({ q: 'パスタ' });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({ q: 'パスタ' });
    });

    it('タグフィルター（tag）でレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({ tag: '和食' });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({ tag: '和食' });
    });

    it('複数タグフィルターでレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe2, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({ tag: '洋食,簡単' });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({ tag: '洋食,簡単' });
    });

    it('カテゴリIDフィルター（categoryId）でレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({ categoryId: 'category1' });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({ categoryId: 'category1' });
    });

    it('カテゴリ名フィルター（category）でレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({ category: 'ご飯' });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({ category: 'ご飯' });
    });

    it('複数フィルターを組み合わせてレシピを絞り込めること', async () => {
      const mockFilteredRecipes = [
        { ...mockRecipe2, ingredients: [], instructions: [] },
      ];
      mockRecipeRepository.findAllSummaryWithFilters.mockResolvedValue(mockFilteredRecipes);

      const result = await recipeService.getAllRecipesWithFilters({
        q: 'パスタ',
        tag: '洋食',
        categoryId: 'category2',
      });

      expect(result).toEqual(mockFilteredRecipes);
      expect(mockRecipeRepository.findAllSummaryWithFilters).toHaveBeenCalledWith({
        q: 'パスタ',
        tag: '洋食',
        categoryId: 'category2',
      });
    });
  });
});
