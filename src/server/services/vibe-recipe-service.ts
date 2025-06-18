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

    // デバッグ情報を出力
    console.log(
      'Available instruction IDs:',
      instructions.map(inst => inst.id)
    );
    console.log(
      'Gemini returned instruction IDs:',
      geminiResponse.instructionIds
    );

    // 3. GeminiのレスポンスからVibeInstructionデータを作成
    const instructionMap = new Map(instructions.map(inst => [inst.id, inst]));
    const vibeInstructionsData = geminiResponse.instructionIds.map(
      (instructionId, index) => {
        const originalInstruction = instructionMap.get(instructionId);
        if (!originalInstruction) {
          console.error(
            `Instruction with ID ${instructionId} not found in available instructions:`,
            instructions.map(inst => inst.id)
          );
          throw new Error(`Instruction with ID ${instructionId} not found`);
        }
        return {
          instructionId,
          step: index + 1, // 1から始まるステップ番号
          recipeId: originalInstruction.recipeId,
        };
      }
    );

    // 4. 新規VibeRecipeを作成・保存
    const newVibeRecipe = await this.vibeRecipeRepository.create(
      recipeIds,
      vibeInstructionsData
    );

    return {
      vibeRecipe: newVibeRecipe,
      isNewlyCreated: true,
    };
  }
}
