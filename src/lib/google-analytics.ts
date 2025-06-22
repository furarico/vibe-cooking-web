/**
 * Google Analytics設定とイベント追跡機能
 *
 * このファイルは以下の機能を提供します：
 * 1. GA初期化の管理
 * 2. カスタムイベントの追跡
 * 3. ページビューの追跡
 * 4. eコマースイベントの追跡
 */

// Google Analytics の測定ID を取得
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

/**
 * Google Analytics が有効かどうかを判定
 * 本番環境でのみ有効にし、開発環境では無効にする
 */
export const isGAEnabled = (): boolean => {
  return !!(GA_MEASUREMENT_ID && process.env.NODE_ENV === 'production');
};

/**
 * gtag関数の型定義
 * Google Analytics のグローバル関数を型安全に使用するため
 */
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * ページビューを追跡
 * ルーティング変更時に呼び出されるべき関数
 *
 * @param url - 追跡するページのURL
 * @param title - ページタイトル（オプション）
 */
export const trackPageView = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_location: url,
    page_title: title,
  });
};

/**
 * カスタムイベントを追跡
 * ユーザーの行動やアプリ内での重要なアクションを記録
 *
 * @param action - イベントのアクション名
 * @param category - イベントのカテゴリ
 * @param label - イベントのラベル（オプション）
 * @param value - イベントの値（オプション、数値）
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * レシピ関連のイベント追跡
 * Vibe Cookingアプリ特有のイベントを追跡
 */
export const trackRecipeEvent = {
  /**
   * レシピ表示イベント
   * @param recipeId - レシピID
   * @param recipeName - レシピ名
   */
  view: (recipeId: string, recipeName: string): void => {
    trackEvent('view_recipe', 'recipe', `${recipeId}: ${recipeName}`);
  },

  /**
   * 調理開始イベント
   * @param recipeId - レシピID
   * @param recipeName - レシピ名
   */
  startCooking: (recipeId: string, recipeName: string): void => {
    trackEvent('start_cooking', 'recipe', `${recipeId}: ${recipeName}`);
  },

  /**
   * 調理完了イベント
   * @param recipeId - レシピID
   * @param recipeName - レシピ名
   * @param cookingTimeMinutes - 調理時間（分）
   */
  completeCooking: (
    recipeId: string,
    recipeName: string,
    cookingTimeMinutes?: number
  ): void => {
    trackEvent(
      'complete_cooking',
      'recipe',
      `${recipeId}: ${recipeName}`,
      cookingTimeMinutes
    );
  },

  /**
   * レシピ検索イベント
   * @param searchTerm - 検索キーワード
   * @param resultsCount - 検索結果数
   */
  search: (searchTerm: string, resultsCount: number): void => {
    trackEvent('search_recipe', 'search', searchTerm, resultsCount);
  },
};

/**
 * バイブレシピ関連のイベント追跡
 */
export const trackVibeRecipeEvent = {
  /**
   * バイブレシピ作成開始イベント
   */
  startCreation: (): void => {
    trackEvent('start_vibe_recipe_creation', 'vibe_recipe');
  },

  /**
   * バイブレシピ作成完了イベント
   * @param recipeCount - 選択されたレシピ数
   */
  completeCreation: (recipeCount: number): void => {
    trackEvent(
      'complete_vibe_recipe_creation',
      'vibe_recipe',
      undefined,
      recipeCount
    );
  },

  /**
   * 音声入力使用イベント
   */
  useVoiceInput: (): void => {
    trackEvent('use_voice_input', 'vibe_recipe');
  },
};

/**
 * PWA関連のイベント追跡
 */
export const trackPWAEvent = {
  /**
   * アプリインストールプロンプト表示イベント
   */
  showInstallPrompt: (): void => {
    trackEvent('show_install_prompt', 'pwa');
  },

  /**
   * アプリインストール完了イベント
   */
  install: (): void => {
    trackEvent('app_install', 'pwa');
  },

  /**
   * オフライン使用イベント
   */
  useOffline: (): void => {
    trackEvent('use_offline', 'pwa');
  },
};

/**
 * ユーザーエンゲージメント追跡
 */
export const trackEngagementEvent = {
  /**
   * セッション継続時間追跡
   * @param durationMinutes - セッション継続時間（分）
   */
  sessionDuration: (durationMinutes: number): void => {
    trackEvent('session_duration', 'engagement', undefined, durationMinutes);
  },

  /**
   * 機能使用回数追跡
   * @param featureName - 機能名
   */
  featureUsage: (featureName: string): void => {
    trackEvent('feature_usage', 'engagement', featureName);
  },
};
