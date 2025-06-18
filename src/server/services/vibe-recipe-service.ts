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

    // 3. GeminiのレスポンスからVibeInstructionデータを作成
    const instructionMap = new Map(instructions.map(inst => [inst.id, inst]));
    const availableIds = new Set(instructions.map(inst => inst.id));

    // Geminiから返されたIDのうち、実際に存在するもののみを使用
    const validInstructionIds = geminiResponse.instructionIds.filter(id => {
      const isValid = availableIds.has(id);
      if (!isValid) {
        console.warn(
          `Instruction with ID ${id} not found in available instructions, skipping`
        );
      }
      return isValid;
    });

    // 不足しているIDがある場合は、利用可能なIDで補完
    const missingIds = instructions
      .map(inst => inst.id)
      .filter(id => !validInstructionIds.includes(id));

    if (missingIds.length > 0) {
      console.warn(`Adding missing instruction IDs: ${missingIds.join(', ')}`);
      validInstructionIds.push(...missingIds);
    }

    const vibeInstructionsData = validInstructionIds.map(
      (instructionId, index) => {
        const originalInstruction = instructionMap.get(instructionId);
        if (!originalInstruction) {
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
