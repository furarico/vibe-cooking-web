import {
  IRecipeRepository,
  RecipeWithDetails,
  CreateRecipeInput,
  UpdateRecipeInput,
} from '../repositories/interfaces/i-recipe-repository';

export interface IRecipeService {
  getAllRecipes(): Promise<RecipeWithDetails[]>;
  getRecipeById(id: string): Promise<RecipeWithDetails>;
  createRecipe(data: CreateRecipeInput): Promise<RecipeWithDetails>;
  updateRecipe(id: string, data: UpdateRecipeInput): Promise<RecipeWithDetails>;
  deleteRecipe(id: string): Promise<void>;
}

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<RecipeWithDetails[]> {
    return this.recipeRepository.findAll();
  }

  async getRecipeById(id: string): Promise<RecipeWithDetails> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async createRecipe(data: CreateRecipeInput): Promise<RecipeWithDetails> {
    this.validateCreateRecipeInput(data);
    return this.recipeRepository.create(data);
  }

  async updateRecipe(
    id: string,
    data: UpdateRecipeInput
  ): Promise<RecipeWithDetails> {
    // レシピの存在確認
    await this.getRecipeById(id);

    this.validateUpdateRecipeInput(data);
    return this.recipeRepository.update(id, data);
  }

  async deleteRecipe(id: string): Promise<void> {
    // レシピの存在確認
    await this.getRecipeById(id);

    return this.recipeRepository.delete(id);
  }

  private validateCreateRecipeInput(data: CreateRecipeInput): void {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Recipe title is required');
    }

    if (!data.ingredients || data.ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient');
    }

    if (!data.instructions || data.instructions.length === 0) {
      throw new Error('Recipe must have at least one instruction');
    }

    // 材料のバリデーション
    data.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name || ingredient.name.trim() === '') {
        throw new Error(`Ingredient ${index + 1}: name is required`);
      }
      if (ingredient.amount <= 0) {
        throw new Error(
          `Ingredient ${index + 1}: amount must be greater than 0`
        );
      }
      if (!ingredient.unit || ingredient.unit.trim() === '') {
        throw new Error(`Ingredient ${index + 1}: unit is required`);
      }
    });

    // 手順のバリデーション
    data.instructions.forEach((instruction, index) => {
      if (instruction.step <= 0) {
        throw new Error(
          `Instruction ${index + 1}: step must be greater than 0`
        );
      }
      if (!instruction.description || instruction.description.trim() === '') {
        throw new Error(`Instruction ${index + 1}: description is required`);
      }
    });

    // 手順番号の重複チェック
    const steps = data.instructions.map(i => i.step);
    const uniqueSteps = new Set(steps);
    if (steps.length !== uniqueSteps.size) {
      throw new Error('Instruction steps must be unique');
    }
  }

  private validateUpdateRecipeInput(data: UpdateRecipeInput): void {
    if (data.title !== undefined && (!data.title || data.title.trim() === '')) {
      throw new Error('Recipe title cannot be empty');
    }

    if (data.ingredients !== undefined) {
      if (data.ingredients.length === 0) {
        throw new Error('Recipe must have at least one ingredient');
      }

      // 材料のバリデーション
      data.ingredients.forEach((ingredient, index) => {
        if (!ingredient.name || ingredient.name.trim() === '') {
          throw new Error(`Ingredient ${index + 1}: name is required`);
        }
        if (ingredient.amount !== undefined && ingredient.amount <= 0) {
          throw new Error(
            `Ingredient ${index + 1}: amount must be greater than 0`
          );
        }
        if (!ingredient.unit || ingredient.unit.trim() === '') {
          throw new Error(`Ingredient ${index + 1}: unit is required`);
        }
      });
    }

    if (data.instructions !== undefined) {
      if (data.instructions.length === 0) {
        throw new Error('Recipe must have at least one instruction');
      }

      // 手順のバリデーション
      data.instructions.forEach((instruction, index) => {
        if (instruction.step !== undefined && instruction.step <= 0) {
          throw new Error(
            `Instruction ${index + 1}: step must be greater than 0`
          );
        }
        if (!instruction.description || instruction.description.trim() === '') {
          throw new Error(`Instruction ${index + 1}: description is required`);
        }
      });

      // 手順番号の重複チェック
      const steps = data.instructions
        .map(i => i.step)
        .filter(step => step !== undefined);
      const uniqueSteps = new Set(steps);
      if (steps.length !== uniqueSteps.size) {
        throw new Error('Instruction steps must be unique');
      }
    }
  }
}

