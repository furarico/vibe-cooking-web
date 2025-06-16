import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ButtonConfig {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  disabled?: boolean;
}

interface FixedBottomButtonProps {
  buttons: ButtonConfig[];
}

// 後方互換性のための単一ボタン用のプロパティ
interface SingleFixedBottomButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  disabled?: boolean;
}

export function FixedBottomButton({ buttons }: FixedBottomButtonProps) {
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
      <div className="max-w-[600px] mx-auto p-6">
        <div className="flex flex-col gap-3">
          {buttons.map((button, index) => {
            if (button.href) {
              return (
                <Button
                  key={index}
                  asChild
                  className="w-full"
                  variant={button.variant || 'default'}
                  disabled={button.disabled}
                >
                  <Link href={button.href}>{button.children}</Link>
                </Button>
              );
            } else {
              return (
                <Button
                  key={index}
                  className="w-full"
                  variant={button.variant || 'default'}
                  disabled={button.disabled}
                  onClick={button.onClick}
                >
                  {button.children}
                </Button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

// 単一ボタン用の便利なコンポーネント
export function SingleFixedBottomButton(props: SingleFixedBottomButtonProps) {
  return <FixedBottomButton buttons={[props]} />;
}
