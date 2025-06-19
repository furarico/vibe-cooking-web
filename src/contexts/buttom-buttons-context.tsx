'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';

export interface ButtonConfig {
  id: string;
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
  className?: string;
}

interface ButtomButtonsContextType {
  buttons: ButtonConfig[];
  setButtons: (buttons: ButtonConfig[]) => void;
  addButton: (button: ButtonConfig) => void;
  removeButton: (id: string) => void;
  clearButtons: () => void;
}

const ButtomButtonsContext = createContext<ButtomButtonsContextType | null>(
  null
);

interface ButtomButtonsProviderProps {
  children: React.ReactNode;
}

export function ButtomButtonsProvider({
  children,
}: ButtomButtonsProviderProps) {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  const addButton = (button: ButtonConfig) => {
    setButtons(prev => [...prev.filter(b => b.id !== button.id), button]);
  };

  const removeButton = (id: string) => {
    setButtons(prev => prev.filter(b => b.id !== id));
  };

  const clearButtons = () => {
    setButtons([]);
  };

  return (
    <ButtomButtonsContext.Provider
      value={{
        buttons,
        setButtons,
        addButton,
        removeButton,
        clearButtons,
      }}
    >
      {children}
    </ButtomButtonsContext.Provider>
  );
}

export function useButtomButtons() {
  const context = useContext(ButtomButtonsContext);
  if (!context) {
    throw new Error(
      'useButtomButtons must be used within a ButtomButtonsProvider'
    );
  }
  return context;
}

export function ButtomButtons() {
  const { buttons } = useButtomButtons();
  const router = useRouter();

  if (buttons.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border-t border-slate-200">
      <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
        {buttons.map(button => {
          // onClickとhrefの両方が設定されている場合
          if (button.onClick && button.href) {
            const handleClickAndNavigate = () => {
              button.onClick!();
              // onClick処理後にナビゲーション
              router.push(button.href!);
            };

            return (
              <Button
                key={button.id}
                className={`w-full ${button.className || ''}`}
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
                key={button.id}
                className={`w-full ${button.className || ''}`}
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
                key={button.id}
                asChild
                className={`w-full ${button.className || ''}`}
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
                key={button.id}
                className={`w-full ${button.className || ''}`}
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
  );
}
