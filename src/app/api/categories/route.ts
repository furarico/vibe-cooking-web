import { sampleCategories } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

// GET /api/categories - カテゴリ一覧を取得
export async function GET() {
  try {
    return NextResponse.json({
      categories: sampleCategories,
    });
  } catch (error) {
    console.error('カテゴリ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}