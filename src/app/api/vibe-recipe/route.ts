import { VibeRecipe } from '@/lib/api-client';
import { withAppCheck } from '@/lib/middleware/app-check';
import { createDIContainer } from '@/server/di/container';
import { NextRequest, NextResponse } from 'next/server';

async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();

    // リクエストボディのバリデーション
    if (
      !body.recipeIds ||
      !Array.isArray(body.recipeIds) ||
      body.recipeIds.length === 0
    ) {
      return NextResponse.json(
        { error: 'recipeIds is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    const { recipeIds } = body;

    // DIコンテナからサービスを取得
    const container = createDIContainer();
    const { vibeRecipeService } = container;

    // VibeRecipeを作成または取得
    const result = await vibeRecipeService.createOrGetVibeRecipe(recipeIds);

    // レスポンス用のデータを整形
    const response: VibeRecipe = {
      id: result.vibeRecipe.id,
      recipeIds: result.vibeRecipe.recipeIds,
      vibeInstructions: result.vibeRecipe.vibeInstructions.map(
        (vi: { id: string; instructionId: string; step: number; recipeId: string }) => ({
          id: vi.id,
          instructionId: vi.instructionId,
          step: vi.step,
          recipeId: vi.recipeId,
        })
      ),
    };

    // 新規作成の場合は201、既存の場合は200を返す
    const status = result.isNewlyCreated ? 201 : 200;

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error('Error in POST /api/vibe-recipe:', error);

    // エラーの種類に応じて適切なステータスコードを返す
    if (error instanceof Error) {
      if (error.message.includes('No instructions found')) {
        return NextResponse.json(
          { error: 'No instructions found for the provided recipe IDs' },
          { status: 400 }
        );
      }
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// AppCheck 検証付きのPOSTハンドラー
export const POST = withAppCheck(handlePost);
