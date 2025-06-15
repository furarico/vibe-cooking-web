'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleGoBack = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      pathSegments.pop(); // 最後のセグメントを削除
      const parentPath =
        pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';
      router.push(parentPath);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-2">
      {pathname !== '/' && (
        <Button variant="outline" size="icon" onClick={handleGoBack}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
      )}
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
    </header>
  );
};

export { Header };
