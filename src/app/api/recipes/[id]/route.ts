import { NextResponse } from 'next/server';
import { sampleRecipes } from '@/lib/mockData';

// GET /api/recipes/[id] - 特定IDのレシピ詳細を取得
export async function GET(
  request: Request,
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
