import { RecipeService } from '../recipe-service';
import { IRecipeRepository } from '@/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api';

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

  describe('searchRecipes', () => {
    const mockRecipes: Recipe[] = [
      createMockRecipe({
        id: '1',
        title: 'チキンカレー',
        description: 'スパイシーで美味しいカレー',
        tags: ['カレー', 'チキン'],
      }),
      createMockRecipe({
        id: '2',
        title: 'ビーフシチュー',
        description: '濃厚なビーフの旨味',
        tags: ['シチュー', 'ビーフ'],
      }),
      createMockRecipe({
        id: '3',
        title: 'チキンサラダ',
        description: 'ヘルシーなサラダ',
        tags: ['サラダ', 'チキン'],
      }),
    ];

    it('タイトルにマッチするレシピを検索できること', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, 'チキン');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('説明にマッチするレシピを検索できること', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, '旨味');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('タグにマッチするレシピを検索できること', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, 'カレー');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('大文字小文字を区別せずに検索できること', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, 'チキン');

      // Assert
      expect(result).toHaveLength(2);
    });

    it('マッチしない場合は空配列を返すこと', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, '存在しない');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('空文字列で検索した場合は元の配列を返すこと', () => {
      // Act
      const result = service.searchRecipes(mockRecipes, '');

      // Assert
      expect(result).toEqual(mockRecipes);
    });
  });

  describe('filterByServings', () => {
    const mockRecipes: Recipe[] = [
      createMockRecipe({ id: '1', servings: 2 }),
      createMockRecipe({ id: '2', servings: 4 }),
      createMockRecipe({ id: '3', servings: 6 }),
      createMockRecipe({ id: '4', servings: undefined }),
    ];

    it('指定した最小人数以上のレシピをフィルタできること', () => {
      // Act
      const result = service.filterByServings(mockRecipes, 4);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
    });

    it('servingsがundefinedのレシピは除外されること', () => {
      // Act
      const result = service.filterByServings(mockRecipes, 1);

      // Assert
      expect(result).toHaveLength(3);
      expect(result.find(r => r.id === '4')).toBeUndefined();
    });

    it('最小人数が0の場合は全てのレシピが含まれること', () => {
      // Act
      const result = service.filterByServings(mockRecipes, 0);

      // Assert
      expect(result).toHaveLength(4);
    });
  });

  describe('filterByMaxTime', () => {
    const mockRecipes: Recipe[] = [
      createMockRecipe({
        id: '1',
        prepTime: 10,
        cookTime: 20,
      }), // 合計30分
      createMockRecipe({
        id: '2',
        prepTime: 15,
        cookTime: 45,
      }), // 合計60分
      createMockRecipe({
        id: '3',
        prepTime: 30,
        cookTime: 90,
      }), // 合計120分
      createMockRecipe({
        id: '4',
        prepTime: undefined,
        cookTime: 20,
      }), // 合計20分
      createMockRecipe({
        id: '5',
        prepTime: 15,
        cookTime: undefined,
      }), // 合計15分
    ];

    it('指定した最大時間以下のレシピをフィルタできること', () => {
      // Act
      const result = service.filterByMaxTime(mockRecipes, 60);

      // Assert
      expect(result).toHaveLength(4);
      expect(result.map(r => r.id)).toEqual(['1', '2', '4', '5']);
    });

    it('prepTimeまたはcookTimeがundefinedの場合は0として扱われること', () => {
      // Act
      const result = service.filterByMaxTime(mockRecipes, 25);

      // Assert
      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toEqual(['4', '5']);
    });

    it('最大時間が0の場合は時間が0のレシピのみ返すこと', () => {
      // Act
      const result = service.filterByMaxTime(mockRecipes, 0);

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
