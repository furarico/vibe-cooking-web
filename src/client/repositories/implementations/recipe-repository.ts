import { DefaultApi, Recipe, RecipesGet200Response } from '@/lib/api-client';
import {
  IRecipeRepository,
  RecipeListFilters,
} from '../interfaces/i-recipe-repository';

export class RecipeRepository implements IRecipeRepository {
  constructor(private apiClient: DefaultApi) {}

  async findAll(): Promise<Recipe[]> {
    try {
      const response: RecipesGet200Response = await this.apiClient.recipesGet();
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }

  async findByCategoryId(categoryId: string): Promise<Recipe[]> {
    try {
      const response: RecipesGet200Response = await this.apiClient.recipesGet({
        categoryId,
      });
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Recipe | null> {
    try {
      const recipe: Recipe = await this.apiClient.recipesIdGet(id);
      return recipe;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  async findWithFilters(filters?: RecipeListFilters): Promise<Recipe[]> {
    try {
      const response: RecipesGet200Response =
        await this.apiClient.recipesGet(filters);
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }
}
