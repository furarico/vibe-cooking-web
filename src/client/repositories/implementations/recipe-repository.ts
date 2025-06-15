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
      console.error('❌ レシピ一覧取得エラー:', error);
      if (error instanceof Error) {
        throw new Error(`レシピ一覧の取得に失敗しました: ${error.message}`);
      }
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

  async findWithFilters(filters?: RecipeListFilters): Promise<Recipe[]> {
    try {
      console.log('📡 フィルター付きレシピ取得開始:', filters);
      const response: RecipesGet200Response =
        await this.apiClient.recipesGet(filters);
      console.log('✅ フィルター付きレシピ取得成功:', response);
      return response.recipes || [];
    } catch (error) {
      console.error('❌ フィルター付きレシピ取得エラー:', error);
      if (error instanceof Error) {
        throw new Error(`レシピの取得に失敗しました: ${error.message}`);
      }
      throw new Error('レシピの取得に失敗しました');
    }
  }
}
