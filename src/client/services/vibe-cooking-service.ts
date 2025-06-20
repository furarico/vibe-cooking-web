import { ILocalStorageRepository } from '../repositories/interfaces/i-local-storage-repository';

const VIBE_COOKING_RECIPES_KEY = 'vibeCookingRecipeIds';

export class VibeCookingService {
  constructor(
    private readonly localStorageRepository: ILocalStorageRepository
  ) {
    // メソッドをバインドして確実に存在するようにする
    this.getVibeCookingRecipeIds = this.getVibeCookingRecipeIds.bind(this);
    this.addVibeCookingRecipeId = this.addVibeCookingRecipeId.bind(this);
    this.removeVibeCookingRecipeId = this.removeVibeCookingRecipeId.bind(this);
    this.clearAllVibeCookingRecipeIds =
      this.clearAllVibeCookingRecipeIds.bind(this);
  }

  getVibeCookingRecipeIds(): string[] {
    return (
      this.localStorageRepository.getItem<string[]>(VIBE_COOKING_RECIPES_KEY) ||
      []
    );
  }

  addVibeCookingRecipeId(recipeId: string): void {
    const vibeCookingRecipeIds = this.getVibeCookingRecipeIds();
    vibeCookingRecipeIds.push(recipeId);
    this.localStorageRepository.setItem(
      VIBE_COOKING_RECIPES_KEY,
      vibeCookingRecipeIds
    );
  }

  removeVibeCookingRecipeId(recipeId: string): void {
    const vibeCookingRecipeIds = this.getVibeCookingRecipeIds();
    const index = vibeCookingRecipeIds.indexOf(recipeId);
    if (index !== -1) {
      vibeCookingRecipeIds.splice(index, 1);
      this.localStorageRepository.setItem(
        VIBE_COOKING_RECIPES_KEY,
        vibeCookingRecipeIds
      );
    }
  }

  clearAllVibeCookingRecipeIds(): void {
    this.localStorageRepository.setItem(VIBE_COOKING_RECIPES_KEY, []);
  }
}
