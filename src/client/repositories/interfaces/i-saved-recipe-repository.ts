/**
 * 保存されたレシピのリポジトリインターフェース
 */
export interface SavedRecipeRepository {
  /**
   * レシピが保存されているかチェック
   */
  isRecipeSaved(recipeId: string): boolean;

  /**
   * レシピを保存する
   */
  saveRecipe(recipeId: string): boolean;

  /**
   * レシピを削除する
   */
  removeRecipe(recipeId: string): boolean;

  /**
   * 保存されたレシピの数を取得
   */
  getSavedRecipesCount(): number;

  /**
   * 保存可能かどうかをチェック
   */
  canSaveMoreRecipes(): boolean;

  /**
   * 保存可能な最大レシピ数を取得
   */
  getMaxSavedRecipes(): number;

  /**
   * 保存されたレシピのIDを取得
   */
  getSavedRecipeIds(): string[];
}
