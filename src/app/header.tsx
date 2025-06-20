'use client';

import Icon from '@/app/favicon.ico';
import { useDI } from '@/client/di/providers';
import { SelectCount } from '@/components/select-count';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ListIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [candidatesCount, setCandidatesCount] = useState(0);
  const router = useRouter();
  const { vibeCookingService } = useDI();

  // candidatesのレシピ数を取得
  const updateCandidatesCount = React.useCallback(() => {
    const vibeCookingRecipeIds = vibeCookingService.getVibeCookingRecipeIds();
    setCandidatesCount(vibeCookingRecipeIds.length);
  }, [vibeCookingService]);

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

  return (
    <header
      className={cn(
        'w-full p-2 flex justify-between items-center gap-2',
        className
      )}
    >
      <Button variant="outline" size="icon" asChild>
        <Link href="/">
          <Image src={Icon} alt="Vibe Cooking" width={24} height={24} />
        </Link>
      </Button>
      <form
        className="w-full flex flex-row items-center gap-2"
        action={() => {
          router.push(`/recipes?q=${searchQuery}`);
        }}
      >
        <Input
          className="placeholder:text-gray-400"
          placeholder="バイブスを言葉に"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button size="icon" type="submit">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
      <div className="relative">
        <Button variant="outline" size="icon" asChild>
          <Link href="/candidates">
            <ListIcon className="w-4 h-4" />
          </Link>
        </Button>
        {candidatesCount > 0 && (
          <div className="absolute -top-2 -right-2">
            <SelectCount count={candidatesCount} />
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
