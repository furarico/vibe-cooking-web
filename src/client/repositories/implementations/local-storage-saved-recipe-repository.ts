import {
  canSaveMoreRecipes,
  getMaxSavedRecipes,
  getSavedRecipes,
  getSavedRecipesCount,
  isRecipeSaved,
  removeRecipe,
  saveRecipe,
} from '@/lib/local-storage';
import { SavedRecipeRepository } from '../interfaces/i-saved-recipe-repository';

/**
 * LocalStorageを使用したSavedRecipeRepositoryの実装
 */
export class LocalStorageSavedRecipeRepository
  implements SavedRecipeRepository {
  /**
   * レシピが保存されているかチェック
   */
  isRecipeSaved(recipeId: string): boolean {
    return isRecipeSaved(recipeId);
  }

  /**
   * レシピを保存する
   */
  saveRecipe(recipeId: string): boolean {
    return saveRecipe(recipeId);
  }

  /**
   * レシピを削除する
   */
  removeRecipe(recipeId: string): boolean {
    return removeRecipe(recipeId);
  }

  /**
   * 保存されたレシピの数を取得
   */
  getSavedRecipesCount(): number {
    return getSavedRecipesCount();
  }

  /**
   * 保存可能かどうかをチェック
   */
  canSaveMoreRecipes(): boolean {
    return canSaveMoreRecipes();
  }

  /**
   * 保存可能な最大レシピ数を取得
   */
  getMaxSavedRecipes(): number {
    return getMaxSavedRecipes();
  }

  /**
   * 保存されたレシピのIDを取得
   */
  getSavedRecipeIds(): string[] {
    return getSavedRecipes();
  }
}
