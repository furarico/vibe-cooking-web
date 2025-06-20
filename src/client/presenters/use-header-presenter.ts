'use client';

import { useDI } from '@/client/di/providers';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export interface HeaderPresenterState {
  searchQuery: string;
  candidatesCount: number;
}

export interface HeaderPresenterActions {
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  updateCandidatesCount: () => void;
}

export const useHeaderPresenter = (): HeaderPresenterState &
  HeaderPresenterActions => {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidatesCount, setCandidatesCount] = useState(0);
  const router = useRouter();
  const { vibeCookingService } = useDI();

  // candidatesのレシピ数を更新
  const updateCandidatesCount = useCallback(() => {
    const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
    setCandidatesCount(vibeCookingRecipeIds.length);
  }, [vibeCookingService]);

  // 検索処理
  const handleSearch = useCallback(() => {
    router.push(`/recipes?q=${searchQuery}`);
  }, [router, searchQuery]);

  useEffect(() => {
    // 初回データ取得
    updateCandidatesCount();

    // リアルタイム更新のためのカスタムイベントリスナーを追加
    const removeListener = vibeCookingService.addUpdateListener(recipeIds => {
      setCandidatesCount(recipeIds.length);
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
    searchQuery,
    candidatesCount,
    setSearchQuery,
    handleSearch,
    updateCandidatesCount,
  };
};
