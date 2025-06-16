// ローカルストレージのキー
const SAVED_RECIPES_KEY = 'saved_recipes';

// 保存可能な最大レシピ数
const MAX_SAVED_RECIPES = 3;

// 保存されたレシピIDの型
export type SavedRecipes = string[];

/**
 * ローカルストレージから保存されたレシピIDリストを取得
 */
export function getSavedRecipes(): SavedRecipes {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = localStorage.getItem(SAVED_RECIPES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('保存されたレシピの取得に失敗しました:', error);
    return [];
  }
}

/**
 * レシピIDをローカルストレージに保存
 * @param recipeId 保存するレシピID
 * @returns 保存に成功した場合はtrue、失敗した場合はfalse
 */
export function saveRecipe(recipeId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const savedRecipes = getSavedRecipes();

    // 既に保存されている場合は何もしない
    if (savedRecipes.includes(recipeId)) {
      console.log(`レシピID ${recipeId} は既に保存されています`);
      return false;
    }

    // 最大保存数に達している場合は保存できない
    if (savedRecipes.length >= MAX_SAVED_RECIPES) {
      console.log(
        `保存可能な最大レシピ数（${MAX_SAVED_RECIPES}）に達しています`
      );
      return false;
    }

    // 新しいレシピIDを追加
    const updatedRecipes = [...savedRecipes, recipeId];
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));

    console.log(`レシピID ${recipeId} を保存しました`);
    return true;
  } catch (error) {
    console.error('レシピの保存に失敗しました:', error);
    return false;
  }
}

/**
 * レシピIDをローカルストレージから削除
 */
export function removeRecipe(recipeId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const savedRecipes = getSavedRecipes();

    // 保存されていない場合は何もしない
    if (!savedRecipes.includes(recipeId)) {
      console.log(`レシピID ${recipeId} は保存されていません`);
      return false;
    }

    // レシピIDを削除
    const updatedRecipes = savedRecipes.filter(id => id !== recipeId);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));

    console.log(`レシピID ${recipeId} を削除しました`);
    return true;
  } catch (error) {
    console.error('レシピの削除に失敗しました:', error);
    return false;
  }
}

/**
 * レシピが保存されているかチェック
 */
export function isRecipeSaved(recipeId: string): boolean {
  const savedRecipes = getSavedRecipes();
  return savedRecipes.includes(recipeId);
}

/**
 * 保存されたレシピの数を取得
 */
export function getSavedRecipesCount(): number {
  return getSavedRecipes().length;
}

/**
 * 保存可能な最大レシピ数を取得
 */
export function getMaxSavedRecipes(): number {
  return MAX_SAVED_RECIPES;
}

/**
 * 保存可能かどうかをチェック
 */
export function canSaveMoreRecipes(): boolean {
  return getSavedRecipesCount() < MAX_SAVED_RECIPES;
}

/**
 * 全ての保存されたレシピを削除
 */
export function clearAllSavedRecipes(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(SAVED_RECIPES_KEY);
    console.log('全ての保存されたレシピを削除しました');
    return true;
  } catch (error) {
    console.error('保存されたレシピの全削除に失敗しました:', error);
    return false;
  }
}
