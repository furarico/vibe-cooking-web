import { withAppCheck } from '@/lib/middleware/app-check';
import { sampleRecipes } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/recipes/[id] - 特定IDのレシピ詳細を取得
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // レシピを検索
    const recipe = sampleRecipes.find(r => r.id === id);

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      );
    }

    // Recipe 形式で返す
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('レシピ詳細取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピ詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// AppCheck 検証付きのGETハンドラー
export const GET = withAppCheck(handleGet);
