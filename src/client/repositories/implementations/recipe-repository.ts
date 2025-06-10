import { DefaultApi, Recipe, RecipesGet200Response } from '@/lib/api-client';
import { IRecipeRepository } from '../interfaces/i-recipe-repository';

export class RecipeRepository implements IRecipeRepository {
  constructor(private apiClient: DefaultApi) {}

  async findAll(): Promise<Recipe[]> {
    try {
      const response: RecipesGet200Response = await this.apiClient.recipesGet();
      return response.recipes || [];
    } catch (error) {
      console.error('レシピ一覧取得エラー:', error);
      throw new Error('レシピ一覧の取得に失敗しました');
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
      console.error('レシピ詳細取得エラー:', error);
      throw new Error('レシピ詳細の取得に失敗しました');
    }
  }
}
