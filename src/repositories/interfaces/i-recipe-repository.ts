import { Recipe } from '@/lib/api';

export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>;
  findById(id: string): Promise<Recipe | null>;
}
