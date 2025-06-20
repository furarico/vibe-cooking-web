'use client';

import { useDI } from '@/client/di/providers';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface HeaderPresenterState {
  searchQuery: string;
  candidatesCount: number;
}

interface HeaderPresenterActions {
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  updateCandidatesCount: () => void;
}

interface HeaderPresenter {
  state: HeaderPresenterState;
  actions: HeaderPresenterActions;
}

export const useHeaderPresenter = (): HeaderPresenter => {
  const [state, setState] = useState<HeaderPresenterState>({
    searchQuery: '',
    candidatesCount: 0,
  });

  const router = useRouter();
  const { vibeCookingService } = useDI();

  // candidatesのレシピ数を更新
  const updateCandidatesCount = useCallback(() => {
    const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
    setState(prev => ({
      ...prev,
      candidatesCount: vibeCookingRecipeIds.length,
    }));
  }, [vibeCookingService]);

  // 検索処理
  const handleSearch = useCallback(() => {
    router.push(`/recipes?q=${state.searchQuery}`);
  }, [router, state.searchQuery]);

  // 検索クエリの設定
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const actions: HeaderPresenterActions = {
    setSearchQuery,
    handleSearch,
    updateCandidatesCount,
  };

  useEffect(() => {
    // 初回データ取得
    updateCandidatesCount();

    // リアルタイム更新のためのカスタムイベントリスナーを追加
    const removeListener = vibeCookingService.addUpdateListener(recipeIds => {
      setState(prev => ({ ...prev, candidatesCount: recipeIds.length }));
    });

    // ウィンドウフォーカス時にもレシピ数を更新（フォールバック）
    window.addEventListener('focus', updateCandidatesCount);

    return () => {
      // クリーンアップ
      removeListener();
      window.removeEventListener('focus', updateCandidatesCount);
    };
  }, [updateCandidatesCount, vibeCookingService]);

  return {
    state,
    actions,
  };
};
