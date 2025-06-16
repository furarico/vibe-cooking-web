import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
      <div className="max-w-xl mx-auto px-4 pt-4 pb-8 lg:pb-4">
        <div className="flex flex-col gap-3">
          {buttons.map((button, index) => {
            // onClickとhrefの両方が設定されている場合
            if (button.onClick && button.href) {
              const handleClickAndNavigate = () => {
                button.onClick!();
                // onClick処理後にナビゲーション
                router.push(button.href!);
              };

              return (
                <Button
                  key={index}
                  className="w-full"
                  variant={button.variant || 'default'}
                  disabled={button.disabled}
                  onClick={handleClickAndNavigate}
                >
                  {button.children}
                </Button>
              );
            }
            // onClickのみが設定されている場合
            else if (button.onClick) {
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
            // hrefのみが設定されている場合
            else if (button.href) {
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
            }
            // どちらも設定されていない場合
            else {
              return (
                <Button
                  key={index}
                  className="w-full"
                  variant={button.variant || 'default'}
                  disabled={button.disabled}
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
