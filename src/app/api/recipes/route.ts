import { sampleRecipes } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

// GET /api/recipes - レシピ一覧を取得
export async function GET() {
  try {
    // RecipesGet200Response 形式で返す
    return NextResponse.json({
      recipes: sampleRecipes,
    });
  } catch (error) {
    console.error('レシピ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    );
  }
}
