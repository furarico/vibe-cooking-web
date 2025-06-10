import { Ingredient, Instruction, Recipe } from '@prisma/client';

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export interface IRecipeRepository {
  findAll(): Promise<RecipeWithDetails[]>;
  findById(id: string): Promise<RecipeWithDetails | null>;
}
