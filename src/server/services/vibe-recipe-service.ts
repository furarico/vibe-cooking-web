import { VibeInstruction, VibeRecipe } from '@prisma/client';
import { GeminiClient } from '../../lib/gemini-client';
import { IVibeRecipeRepository } from '../repositories/interfaces/i-vibe-recipe-repository';

// vibeInstructionsを含む拡張型を定義
type VibeRecipeWithInstructions = VibeRecipe & {
  vibeInstructions: VibeInstruction[];
};

export class VibeRecipeService {
  constructor(
    private vibeRecipeRepository: IVibeRecipeRepository,
    private geminiClient: GeminiClient
  ) {}

  async createOrGetVibeRecipe(recipeIds: string[]): Promise<{
    vibeRecipe: VibeRecipeWithInstructions;
    isNewlyCreated: boolean;
  }> {
    // 既存のVibeRecipeを検索
    const existingVibeRecipe =
      await this.vibeRecipeRepository.findByRecipeIds(recipeIds);

    if (existingVibeRecipe) {
      return {
        vibeRecipe: existingVibeRecipe,
        isNewlyCreated: false,
      };
    }

    // 新規作成が必要な場合
    // 1. 各recipeIdに紐づくInstructionを取得
    const instructions =
      await this.vibeRecipeRepository.getInstructionsByRecipeIds(recipeIds);

    if (instructions.length === 0) {
      throw new Error('No instructions found for the provided recipe IDs');
    }

    // 2. Geminiに手順の並び替えを依頼
    const geminiResponse = await this.geminiClient.generateOrderedInstructions(
      recipeIds,
      instructions
    );

    // 3. 新規VibeRecipeを作成・保存
    const newVibeRecipe = await this.vibeRecipeRepository.create(
      recipeIds,
      geminiResponse.instructions
    );

    return {
      vibeRecipe: newVibeRecipe,
      isNewlyCreated: true,
    };
  }
}
