import type { ICategoryRepository } from '@/client/repositories/interfaces/i-category-repository';
import type { Category } from '@/lib/api-client';

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
