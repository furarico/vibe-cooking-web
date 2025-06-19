import { StepBadge } from '@/components/step-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import * as React from 'react';

interface CookingInstructionCardProps {
  step: number | null;
  title: string;
  description: string;
  imageUrl: string | null;
}

const CookingInstructionCard = React.forwardRef<
  HTMLDivElement,
  CookingInstructionCardProps
>(({ step, title, description, imageUrl }, ref) => {
  return (
    <Card ref={ref}>
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          {step && <StepBadge step={step} />}
          <div className="text-xl font-bold text-gray-900">{title}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <p className="w-full text-sm text-gray-900">{description}</p>
          {imageUrl && imageUrl.length > 0 && (
            <Image
              src={imageUrl}
              alt={title}
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-lg border-2 border-slate-200"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CookingInstructionCard.displayName = 'CookingInstructionCard';

export { CookingInstructionCard };
export type { CookingInstructionCardProps };
