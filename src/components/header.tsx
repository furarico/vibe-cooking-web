'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 w-full">
        <Input
          className="placeholder:text-gray-400"
          placeholder="レシピを検索"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button asChild>
          <Link href={`/recipes?q=${searchQuery}`}>
            <SearchIcon className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export { Header };
