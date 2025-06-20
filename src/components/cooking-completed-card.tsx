import { Card } from '@/components/ui/card';
import Image from 'next/image';

type CookingCompletedCardProps = {
  className?: string;
};

export const CookingCompletedCard: React.FC<CookingCompletedCardProps> = ({
  className,
}) => {
  return (
    <Card
      className={`w-full max-w-[600px] flex justify-center items-center pb-8 ${className || ''}`}
    >
      <div className="flex flex-col items-center ">
        <div className="w-60 h-60 relative">
          <Image
            src="/icon-192x192.png"
            alt="調理中アイコン"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-full"
          />
        </div>
        <p className="text-xl text-gray-600 whitespace-nowrap">
          できあがりだバイブ！
        </p>
      </div>
    </Card>
  );
};
