import { Category } from '@prisma/client';
import { components } from '../../types/api';
import { ICategoryRepository } from '../repositories/interfaces/i-category-repository';

// OpenAPI スキーマの Category 型
type APICategory = components['schemas']['Category'];

export interface ICategoryService {
  getAllCategories(): Promise<APICategory[]>;
  getCategoryById(id: string): Promise<APICategory | null>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAllCategories(): Promise<APICategory[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(category => this.convertToAPICategory(category));
  }

  async getCategoryById(id: string): Promise<APICategory | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      return null;
    }
    return this.convertToAPICategory(category);
  }

  private convertToAPICategory(category: Category): APICategory {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
