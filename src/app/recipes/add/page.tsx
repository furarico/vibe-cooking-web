'use client';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { useState } from 'react';

export default function Page() {
  const [recipeId, setRecipeId] = useState<string>('');
  return (
    <div className="w-full max-w-[600px] mx-auto min-h-screen p-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          <FixedBottomButton
            buttons={[
              {
                href: `/recipes/${recipeId}/cooking`,
                children: 'Vibe Cooking をはじめる',
              },
            ]}
          />
        </h1>
      </div>
    </div>
  );
}
