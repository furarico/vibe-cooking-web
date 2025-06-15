import { Recipe } from '@/lib/api-client';

export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>;
  findByCategoryId(categoryId: string): Promise<Recipe[]>;
  findById(id: string): Promise<Recipe | null>;
}
