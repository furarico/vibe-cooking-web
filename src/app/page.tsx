import { RecipeList } from '@/components/features/recipe/RecipeList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🍳 Vibe Cooking
          </h1>
          <p className="text-gray-600 mt-2">
            美味しいレシピで素敵な料理時間を - レイヤードアーキテクチャ対応版
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <RecipeList />
      </main>

      {/* フッター */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Vibe Cooking. All rights reserved.
          </p>
          <p className="text-center text-gray-400 text-xs mt-2">
            Built with Layered Architecture - Repository, Service, Presenter, UI
          </p>
        </div>
      </footer>
    </div>
  );
}
