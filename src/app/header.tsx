'use client';

import Icon from '@/app/favicon.ico';
import { useHeaderPresenter } from '@/client/presenters/use-header-presenter';
import { SelectCount } from '@/components/select-count';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ListIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const { state, actions } = useHeaderPresenter();

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
        action={actions.handleSearch}
      >
        <Input
          className="placeholder:text-gray-400"
          placeholder="バイブスを言葉に"
          value={state.searchQuery}
          onChange={e => actions.setSearchQuery(e.target.value)}
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
        {state.candidatesCount > 0 && (
          <div className="absolute -top-2 -right-2">
            <SelectCount count={state.candidatesCount} />
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
