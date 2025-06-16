import { LocalStorageSavedRecipeRepository } from '../repositories/implementations/local-storage-saved-recipe-repository';
import { SavedRecipeRepository } from '../repositories/interfaces/saved-recipe-repository';
import { SavedRecipeService } from '../services/saved-recipe-service';

/**
 * SavedRecipe関連の依存性注入コンテナ
 */
export class SavedRecipeContainer {
  private static _repository: SavedRecipeRepository | null = null;
  private static _service: SavedRecipeService | null = null;

  /**
   * SavedRecipeRepositoryのインスタンスを取得
   */
  static getRepository(): SavedRecipeRepository {
    if (!this._repository) {
      this._repository = new LocalStorageSavedRecipeRepository();
    }
    return this._repository;
  }

  /**
   * SavedRecipeServiceのインスタンスを取得
   */
  static getService(): SavedRecipeService {
    if (!this._service) {
      this._service = new SavedRecipeService(this.getRepository());
    }
    return this._service;
  }

  /**
   * テスト用: 依存関係をリセット
   */
  static reset(): void {
    this._repository = null;
    this._service = null;
  }

  /**
   * テスト用: モックRepositoryを注入
   */
  static setRepository(repository: SavedRecipeRepository): void {
    this._repository = repository;
    this._service = null; // Serviceも再作成が必要
  }
}
