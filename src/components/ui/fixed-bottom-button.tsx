import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FixedBottomButtonProps {
  href: string;
  children: React.ReactNode;
}

export function FixedBottomButton({ href, children }: FixedBottomButtonProps) {
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
      <div className="max-w-[600px] mx-auto p-6">
        <Button asChild className="w-full">
          <Link href={href}>{children}</Link>
        </Button>
      </div>
    </div>
  );
}
