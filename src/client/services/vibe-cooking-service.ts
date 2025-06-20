import { ILocalStorageRepository } from '../repositories/interfaces/i-local-storage-repository';

const VIBE_COOKING_RECIPES_KEY = 'vibeCookingRecipeIds';
const VIBE_COOKING_UPDATED_EVENT = 'vibeCookingUpdated';

export class VibeCookingService {
  constructor(
    private readonly localStorageRepository: ILocalStorageRepository
  ) {}

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
    this.dispatchUpdateEvent();
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
      this.dispatchUpdateEvent();
    }
  }

  clearAllVibeCookingRecipeIds(): void {
    this.localStorageRepository.setItem(VIBE_COOKING_RECIPES_KEY, []);
    this.dispatchUpdateEvent();
  }

  private dispatchUpdateEvent(): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(VIBE_COOKING_UPDATED_EVENT, {
        detail: { recipeIds: this.getVibeCookingRecipeIds() },
      });
      window.dispatchEvent(event);
    }
  }

  addUpdateListener(callback: (recipeIds: string[]) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleUpdate = (event: CustomEvent) => {
      callback(event.detail.recipeIds);
    };

    window.addEventListener(
      VIBE_COOKING_UPDATED_EVENT,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        VIBE_COOKING_UPDATED_EVENT,
        handleUpdate as EventListener
      );
    };
  }
}
