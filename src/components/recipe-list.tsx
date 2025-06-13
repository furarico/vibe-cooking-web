import { components } from '@/types/api';
import React from 'react';

type Recipe = components['schemas']['Recipe'];

interface RecipeListProps {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  onSelectRecipe: (recipeId: string) => void;
  onRefreshRecipes: () => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  loading,
  error,
  onSelectRecipe,
  onRefreshRecipes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">レシピ一覧</h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">
          <p>エラー: {error}</p>
          <button
            onClick={onRefreshRecipes}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            再試行
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => recipe.id && onSelectRecipe(recipe.id)}
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {recipe.title || '無題のレシピ'}
                </h3>
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {recipe.prepTime && (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {recipe.prepTime}分
                      </span>
                    )}
                    {recipe.servings && <span>{recipe.servings}人分</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
