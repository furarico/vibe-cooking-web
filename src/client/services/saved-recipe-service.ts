import { SavedRecipeRepository } from '../repositories/interfaces/i-saved-recipe-repository';

/**
 * 保存レシピのサービス層
 * ビジネスロジックを管理する
 */
export class SavedRecipeService {
  constructor(private readonly repository: SavedRecipeRepository) { }

  /**
   * レシピが保存されているかチェック
   */
  isRecipeSaved(recipeId: string): boolean {
    return this.repository.isRecipeSaved(recipeId);
  }

  /**
   * 保存可能かどうかをチェック
   */
  canSaveMoreRecipes(): boolean {
    return this.repository.canSaveMoreRecipes();
  }

  /**
   * レシピを保存する
   * @param recipeId 保存するレシピID
   * @returns 保存結果と次の遷移先
   */
  saveRecipe(recipeId: string): {
    success: boolean;
    nextRoute?: string;
  } {
    if (!recipeId) {
      console.error('レシピIDが指定されていません');
      return { success: false };
    }

    // 保存前の状態をチェック
    const currentCount = this.repository.getSavedRecipesCount();
    const success = this.repository.saveRecipe(recipeId);

    if (!success) {
      return { success: false };
    }

    // ビジネスルール: 保存数に応じて遷移先を決定
    let nextRoute: string;
    if (currentCount === 2) {
      // 3つ目を追加した場合は追加画面に遷移
      nextRoute = '/candidates';
    } else {
      // 1つ目、2つ目の場合はホーム画面に遷移
      nextRoute = '/';
    }

    return { success: true, nextRoute };
  }

  /**
   * レシピを削除する
   */
  removeRecipe(recipeId: string): boolean {
    if (!recipeId) {
      console.error('レシピIDが指定されていません');
      return false;
    }

    return this.repository.removeRecipe(recipeId);
  }

  /**
   * 保存状態をトグルする
   * @param recipeId レシピID
   * @returns トグル結果と次の遷移先（保存時のみ）
   */
  toggleSaveRecipe(recipeId: string): {
    success: boolean;
    isSaved: boolean;
    nextRoute?: string;
  } {
    const currentlySaved = this.repository.isRecipeSaved(recipeId);

    if (currentlySaved) {
      const success = this.removeRecipe(recipeId);
      return { success, isSaved: false };
    } else {
      const result = this.saveRecipe(recipeId);
      return {
        success: result.success,
        isSaved: result.success,
        nextRoute: result.nextRoute,
      };
    }
  }

  getSavedRecipeIds(): string[] {
    return this.repository.getSavedRecipeIds();
  }
}
