import { type ButtonConfig, useButtomButtons } from '@/contexts/buttom-buttons-context';
import { useEffect } from 'react';

/**
 * ページ固有のボタンを設定するためのカスタムフック
 * @param buttons 設定するボタンの配列
 * @param deps 依存配列（ボタンの内容が変わる条件）
 * 
 * @example
 * ```tsx
 * // 複数ボタンの設定例
 * usePageButtons([
 *   {
 *     id: 'save',
 *     onClick: handleSave,
 *     children: '保存',
 *     variant: 'default'
 *   },
 *   {
 *     id: 'cancel',
 *     href: '/back',
 *     children: 'キャンセル',
 *     variant: 'outline'
 *   }
 * ], [someState]);
 * ```
 */
export function usePageButtons(buttons: ButtonConfig[], deps: unknown[] = []) {
  const { setButtons, clearButtons } = useButtomButtons();

  useEffect(() => {
    setButtons(buttons);

    // クリーンアップ関数でボタンをクリア
    return () => {
      clearButtons();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * 単一のボタンを設定するためのカスタムフック
 * @param button 設定するボタン
 * @param deps 依存配列（ボタンの内容が変わる条件）
 * 
 * @example
 * ```tsx
 * // 単一ボタンの設定例
 * usePageButton({
 *   id: 'submit',
 *   onClick: handleSubmit,
 *   children: '送信',
 *   disabled: isLoading
 * }, [isLoading]);
 * ```
 */
export function usePageButton(button: ButtonConfig, deps: unknown[] = []) {
  usePageButtons([button], deps);
}

/**
 * 動的にボタンを追加・削除するためのカスタムフック
 * 
 * @example
 * ```tsx
 * const { addButton, removeButton, clearButtons } = useDynamicButtons();
 * 
 * // ボタンを動的に追加
 * const handleAddButton = () => {
 *   addButton({
 *     id: 'dynamic-button',
 *     onClick: () => console.log('動的ボタン'),
 *     children: '動的に追加されたボタン'
 *   });
 * };
 * 
 * // ボタンを削除
 * const handleRemoveButton = () => {
 *   removeButton('dynamic-button');
 * };
 * ```
 */
export function useDynamicButtons() {
  const { addButton, removeButton, clearButtons } = useButtomButtons();

  return {
    addButton,
    removeButton,
    clearButtons,
  };
} 
