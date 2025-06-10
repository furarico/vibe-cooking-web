import { Recipe, Ingredient, Instruction } from '@prisma/client';

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export interface IRecipeRepository {
  findAll(): Promise<RecipeWithDetails[]>;
  findById(id: string): Promise<RecipeWithDetails | null>;
  create(data: CreateRecipeInput): Promise<RecipeWithDetails>;
  update(id: string, data: UpdateRecipeInput): Promise<RecipeWithDetails>;
  delete(id: string): Promise<void>;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  tags?: string[];
  ingredients: CreateIngredientInput[];
  instructions: CreateInstructionInput[];
}

export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  tags?: string[];
  ingredients?: UpdateIngredientInput[];
  instructions?: UpdateInstructionInput[];
}

export interface CreateIngredientInput {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface UpdateIngredientInput {
  id?: string;
  name?: string;
  amount?: number;
  unit?: string;
  notes?: string;
}

export interface CreateInstructionInput {
  step: number;
  description: string;
  imageUrl?: string;
  estimatedTime?: number;
}

export interface UpdateInstructionInput {
  id?: string;
  step?: number;
  description?: string;
  imageUrl?: string;
  estimatedTime?: number;
}

