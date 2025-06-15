'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <form
        className="flex items-center gap-2 w-full"
        action={() => {
          router.push(`/recipes?q=${searchQuery}`);
        }}
      >
        <Input
          className="placeholder:text-gray-400"
          placeholder="レシピを検索"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button type="submit">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
    </header>
  );
};

export { Header };
