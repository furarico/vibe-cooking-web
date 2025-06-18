import { useDI } from '@/client/di/providers';
import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import { AudioPlayerService } from '@/client/services/audio-player-service';
import { AudioRecognitionService } from '@/client/services/audio-recognition-service';
import { RecipeService } from '@/client/services/recipe-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook } from '@testing-library/react';

// DIプロバイダーをモック
jest.mock('@/client/di/providers');

// Firebase環境変数をモック
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key';

const mockRecipeService = {
  getRecipeById: jest.fn(),
  getAllRecipes: jest.fn(),
  getRecipesByCategoryId: jest.fn(),
} as Partial<RecipeService> as jest.Mocked<RecipeService>;

const mockAudioPlayerService = {
  isPlaying: jest.fn().mockReturnValue(false),
  getCurrentAudioUrl: jest.fn().mockReturnValue(null),
  playAudio: jest.fn(),
  stopAudio: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
} as Partial<AudioPlayerService> as jest.Mocked<AudioPlayerService>;

const mockAudioRecognitionService = {
  getAudioRecognitionStatus: jest.fn().mockReturnValue('idle'),
  getTranscript: jest.fn().mockReturnValue(''),
  getInterimTranscript: jest.fn().mockReturnValue(''),
  getTriggerHistory: jest.fn().mockReturnValue([]),
  addListener: jest.fn(),
  removeListener: jest.fn(),
} as Partial<AudioRecognitionService> as jest.Mocked<AudioRecognitionService>;

const mockUseDI = useDI as jest.MockedFunction<typeof useDI>;

const mockRecipe: Recipe = {
  id: '1',
  title: 'テストレシピ',
  description: 'テスト用のレシピです',
  instructions: [
    {
      step: 1,
      title: 'ステップ1',
      description: '最初のステップです',
    },
    {
      step: 2,
      title: 'ステップ2',
      description: '2番目のステップです',
    },
    {
      step: 3,
      title: 'ステップ3',
      description: '最後のステップです',
    },
  ],
};

beforeEach(() => {
  mockUseDI.mockReturnValue({
    recipeService: mockRecipeService,
    audioPlayerService: mockAudioPlayerService,
    audioRecognitionService: mockAudioRecognitionService,
  });
  jest.clearAllMocks();
});

describe('useCookingPresenter', () => {
  describe('初期状態', () => {
    it('初期状態が正しく設定されるべき', () => {
      const { result } = renderHook(() => useCookingPresenter());

      expect(result.current.state.recipe).toBeNull();
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.currentStep).toBe(0);
      expect(result.current.state.totalSteps).toBe(0);
      expect(result.current.state.carouselApi).toBeNull();
      expect(result.current.state.audioRecognitionStatus).toBe('idle');
      expect(result.current.state.transcript).toBe('');
      expect(result.current.state.interimTranscript).toBe('');
      expect(result.current.state.triggerHistory).toEqual([]);
      expect(result.current.state.audioStatus.isPlaying).toBe(false);
      expect(result.current.state.audioStatus.currentAudioUrl).toBeNull();
    });
  });

  describe('fetchRecipe', () => {
    it('レシピを正常に取得できるべき', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.actions.fetchRecipe('1');
      });

      expect(mockRecipeService.getRecipeById).toHaveBeenCalledWith('1');
      expect(result.current.state.recipe).toEqual(mockRecipe);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.currentStep).toBe(0);
      expect(result.current.state.totalSteps).toBe(3);
    });

    it('レシピ取得中はローディング状態になるべき', async () => {
      let resolvePromise: (value: Recipe) => void;
      const longRunningPromise = new Promise<Recipe>(resolve => {
        resolvePromise = resolve;
      });

      mockRecipeService.getRecipeById.mockReturnValue(longRunningPromise);

      const { result } = renderHook(() => useCookingPresenter());

      act(() => {
        result.current.actions.fetchRecipe('1');
      });

      expect(result.current.state.loading).toBe(true);

      await act(async () => {
        resolvePromise!(mockRecipe);
        await longRunningPromise;
      });

      expect(result.current.state.loading).toBe(false);
    });

    it('レシピが見つからない場合はローディングが停止するべき', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(null);

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.actions.fetchRecipe('999');
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.recipe).toBeNull();
    });

    it('レシピ取得エラー時はローディングが停止するべき', async () => {
      mockRecipeService.getRecipeById.mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.actions.fetchRecipe('1');
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.recipe).toBeNull();
    });
  });

  describe('ステップ管理', () => {
    beforeEach(async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
    });

    it('setCurrentStepで現在のステップを設定できるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.actions.fetchRecipe('1');
      });

      act(() => {
        result.current.actions.setCurrentStep(1);
      });

      expect(result.current.state.currentStep).toBe(1);
    });
  });

  describe('カルーセルAPI', () => {
    it('setCarouselApiでカルーセルAPIを設定できるべき', () => {
      const { result } = renderHook(() => useCookingPresenter());
      const mockCarouselApi = {
        selectedScrollSnap: jest.fn().mockReturnValue(0),
        scrollTo: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      };

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.current.actions.setCarouselApi(mockCarouselApi as any);
      });

      expect(result.current.state.carouselApi).toBe(mockCarouselApi);
    });
  });
});
