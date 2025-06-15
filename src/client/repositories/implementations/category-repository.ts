import type { Category, DefaultApi } from '@/lib/api-client';
import type { ICategoryRepository } from '../interfaces/i-category-repository';

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly apiClient: DefaultApi) {}

  async findAll(): Promise<Category[]> {
    try {
      const response = await this.apiClient.categoriesGet();
      return response.categories ?? [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }
}
