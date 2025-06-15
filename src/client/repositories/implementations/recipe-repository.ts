import { DefaultApi, Recipe, RecipesGet200Response } from '@/lib/api-client';
import {
  IRecipeRepository,
  RecipeListFilters,
} from '../interfaces/i-recipe-repository';

export class RecipeRepository implements IRecipeRepository {
  constructor(private apiClient: DefaultApi) {}

  async findAll(): Promise<Recipe[]> {
    try {
      console.log('📡 レシピ一覧取得開始');
      const response: RecipesGet200Response = await this.apiClient.recipesGet();
      console.log('✅ レシピ一覧取得成功:', response);
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }

  async findByCategoryId(categoryId: string): Promise<Recipe[]> {
    try {
      console.log('📡 カテゴリ別レシピ一覧取得開始:', categoryId);
      const response: RecipesGet200Response = await this.apiClient.recipesGet({
        categoryId,
      });
      console.log('✅ カテゴリ別レシピ一覧取得成功:', response);
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Recipe | null> {
    try {
      const recipe: Recipe = await this.apiClient.recipesIdGet(id);
      console.log('✅ レシピ取得成功:', recipe);
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
      console.log('📡 フィルター付きレシピ取得開始:', filters);
      const response: RecipesGet200Response =
        await this.apiClient.recipesGet(filters);
      console.log('✅ フィルター付きレシピ取得成功:', response);
      return response.recipes || [];
    } catch (error) {
      throw error;
    }
  }
}
