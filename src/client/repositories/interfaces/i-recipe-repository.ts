import { Recipe } from '@/lib/api-client';

export interface RecipeListFilters {
  q?: string;
  tag?: string;
  category?: string;
  categoryId?: string;
}

export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>;
  findByCategoryId(categoryId: string): Promise<Recipe[]>;
  findById(id: string): Promise<Recipe | null>;
  findWithFilters(filters?: RecipeListFilters): Promise<Recipe[]>;
}
