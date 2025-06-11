import { Ingredient, Instruction, Recipe } from '@prisma/client';

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export interface RecipeFilters {
  q?: string; // テキスト検索
  tag?: string; // タグフィルター（カンマ区切りで複数指定可能）
  category?: string; // カテゴリフィルター（カテゴリ名）
  categoryId?: string; // カテゴリフィルター（カテゴリID）
}

export interface IRecipeRepository {
  findAll(): Promise<RecipeWithDetails[]>;
  findAllSummary(): Promise<RecipeWithDetails[]>;
  findAllSummaryWithFilters(filters: RecipeFilters): Promise<RecipeWithDetails[]>;
  findById(id: string): Promise<RecipeWithDetails | null>;
}
