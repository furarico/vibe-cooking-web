import Image from 'next/image';
import { Card } from './card';

export interface CookingStatusCardProps {
  recipeNames: string[];
  className?: string;
}

export const CookingStatusCard = ({
  recipeNames,
  className,
}: CookingStatusCardProps) => {
  // 最大3つまでに制限
  const displayNames = recipeNames.slice(0, 3);

  return (
    <Card
      className={`w-full max-w-240 flex items-center px-8 py-4 gap-8 ${className || ''}`}
    >
      {/* 左側: アイコンと調理中テキスト */}
      <div className="flex flex-col items-center space-y-2 min-w-0 flex-shrink-0">
        <div className="w-12 h-12 relative">
          <Image
            src="/icon-192x192.png"
            alt="調理中アイコン"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <p className="text-sm text-gray-600 whitespace-nowrap">調理中...</p>
      </div>

      {/* 右側: 料理名リスト */}
      <div className="flex-1 min-w-0">
        <div className="gap-2">
          {displayNames.map((name, index) => (
            <div
              key={index}
              className="text-base font-bold text-gray-900 truncate"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
