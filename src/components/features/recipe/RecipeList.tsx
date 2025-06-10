'use client';

import React from 'react';
import { useRecipePresenter } from '@/presenters/hooks/useRecipePresenter';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RecipeCard } from './RecipeCard';
import { RecipeDialog } from './RecipeDialog';

export const RecipeList: React.FC = () => {
  const {
    filteredRecipes,
    selectedRecipe,
    loading,
    error,
    searchQuery,
    difficultyFilter,
    showDialog,
    selectRecipe,
    closeDialog,
    setSearchQuery,
    setDifficultyFilter,
    refreshRecipes
  } = useRecipePresenter();

  if (loading) {
    return <LoadingSpinner message="レシピを読み込み中..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <ErrorMessage
          message={error}
          onRetry={refreshRecipes}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🍳 レシピ一覧</h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* 検索ボックス */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="レシピを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 難易度フィルター */}
            <div className="md:w-48">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべての難易度</option>
                <option value="easy">簡単</option>
                <option value="medium">普通</option>
                <option value="hard">難しい</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredRecipes.length}件のレシピが見つかりました
          </div>
        </div>

        {/* レシピ一覧 */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に合うレシピが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={selectRecipe}
              />
            ))}
          </div>
        )}
      </div>

      {/* ダイアログ */}
      {selectedRecipe && (
        <RecipeDialog
          recipe={selectedRecipe}
          isOpen={showDialog}
          onClose={closeDialog}
        />
      )}
    </>
  );
};