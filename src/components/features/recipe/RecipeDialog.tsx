import React from 'react';
import { useRouter } from 'next/navigation';
import { EnrichedRecipe } from '@/services/recipe/RecipeService';

interface RecipeDialogProps {
  recipe: EnrichedRecipe;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDialog: React.FC<RecipeDialogProps> = ({
  recipe,
  isOpen,
  onClose
}) => {
  const router = useRouter();

  const handleStartCooking = () => {
    if (recipe.id) {
      router.push(`/recipes/${recipe.id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ダイアログヘッダー */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">
              {recipe.title || 'タイトル未設定'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ダイアログ内容 */}
        <div className="p-6">
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title || ''}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <p className="text-gray-600 mb-4">
            {recipe.description || '説明がありません'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <span className="font-semibold">準備時間: </span>
              <span>{recipe.prepTime || 0}分</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">調理時間: </span>
              <span>{recipe.cookTime || 0}分</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">人数分: </span>
              <span>{recipe.servings || '不明'}人分</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">合計時間: </span>
              <span>{recipe.formattedTime}</span>
            </div>
          </div>

          <div className="mb-4">
            <span className="font-semibold text-sm">難易度: </span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              recipe.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800' :
              recipe.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {recipe.difficultyLevel === 'easy' ? '簡単' :
               recipe.difficultyLevel === 'medium' ? '普通' : '難しい'}
            </span>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold text-sm">タグ: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">材料一覧</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>{ingredient.name}</span>
                    <span>{ingredient.amount}{ingredient.unit}</span>
                  </div>
                ))}
                {recipe.ingredients.length > 5 && (
                  <div className="text-sm text-gray-500 mt-2">
                    ...他 {recipe.ingredients.length - 5} 種類
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ダイアログフッター */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleStartCooking}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            🍳 調理を始める
          </button>
        </div>
      </div>
    </div>
  );
};