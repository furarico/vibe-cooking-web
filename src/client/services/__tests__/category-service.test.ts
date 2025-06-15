import { ICategoryRepository } from '@/client/repositories/interfaces/i-category-repository';
import { Category } from '@/lib/api-client';
import { CategoryService } from '../category-service';

const mockCategoryRepository = {
  findAll: jest.fn(),
} as jest.Mocked<ICategoryRepository>;

describe('CategoryService', () => {
  let service: CategoryService;

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'メイン料理',
    },
    {
      id: '2',
      name: 'デザート',
    },
    {
      id: '3',
      name: 'サイドディッシュ',
    },
  ];

  beforeEach(() => {
    service = new CategoryService(mockCategoryRepository);
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('すべてのカテゴリを取得する', async () => {
      mockCategoryRepository.findAll.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('リポジトリがエラーを返した場合はエラーを再スローする', async () => {
      const error = new Error('Repository error');
      mockCategoryRepository.findAll.mockRejectedValue(error);

      await expect(service.getAllCategories()).rejects.toThrow(
        'Repository error'
      );
      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('空の配列が返された場合は空の配列を返す', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllCategories();

      expect(result).toEqual([]);
      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('複数回呼び出してもリポジトリが適切に呼び出される', async () => {
      mockCategoryRepository.findAll.mockResolvedValue(mockCategories);

      await service.getAllCategories();
      await service.getAllCategories();

      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(2);
    });
  });
});
