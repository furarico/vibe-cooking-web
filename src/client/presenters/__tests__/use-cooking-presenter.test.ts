import { useDI } from '@/client/di/providers';
import { useCookingPresenter } from '@/client/presenters/use-cooking-presenter';
import { RecipeService } from '@/client/services/recipe-service';
import { Recipe } from '@/lib/api-client';
import { act, renderHook } from '@testing-library/react';

// DIプロバイダーをモック
jest.mock('@/client/di/providers');

const mockRecipeService = {
  getRecipeById: jest.fn(),
  getAllRecipes: jest.fn(),
  getRecipesByCategoryId: jest.fn(),
} as Partial<RecipeService> as jest.Mocked<RecipeService>;

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
  });
  jest.clearAllMocks();
});

describe('useCookingPresenter', () => {
  describe('初期状態', () => {
    it('初期状態が正しく設定されるべき', () => {
      const { result } = renderHook(() => useCookingPresenter());

      expect(result.current.recipe).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.totalSteps).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });
  });

  describe('fetchRecipe', () => {
    it('レシピを正常に取得できるべき', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      expect(mockRecipeService.getRecipeById).toHaveBeenCalledWith('1');
      expect(result.current.recipe).toEqual(mockRecipe);
      expect(result.current.loading).toBe(false);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.totalSteps).toBe(3);
      expect(result.current.isCompleted).toBe(false);
    });

    it('レシピ取得中はローディング状態になるべき', async () => {
      let resolvePromise: (value: Recipe) => void;
      const longRunningPromise = new Promise<Recipe>(resolve => {
        resolvePromise = resolve;
      });

      mockRecipeService.getRecipeById.mockReturnValue(longRunningPromise);

      const { result } = renderHook(() => useCookingPresenter());

      act(() => {
        result.current.fetchRecipe('1');
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!(mockRecipe);
        await longRunningPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('レシピが見つからない場合はローディングが停止するべき', async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(null);

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('999');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.recipe).toBeNull();
    });

    it('レシピ取得エラー時はローディングが停止するべき', async () => {
      mockRecipeService.getRecipeById.mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.recipe).toBeNull();
    });
  });

  describe('ステップ管理', () => {
    beforeEach(async () => {
      mockRecipeService.getRecipeById.mockResolvedValue(mockRecipe);
    });

    it('setCurrentStepで現在のステップを設定できるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.setCurrentStep(1);
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);
    });

    it('最後のステップに設定すると完了状態になるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.setCurrentStep(2); // 最後のステップ（0-indexed）
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.isCompleted).toBe(true);
    });

    it('範囲外のステップは制限されるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.setCurrentStep(-1);
      });
      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.setCurrentStep(10);
      });
      expect(result.current.currentStep).toBe(2); // 最大ステップ
    });

    it('nextStepで次のステップに進めるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.isCompleted).toBe(true);

      // 最後のステップでnextStepしても変わらない
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('prevStepで前のステップに戻れるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.setCurrentStep(2);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);

      // 最初のステップでprevStepしても変わらない
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('resetProgressで進行状況をリセットできるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.setCurrentStep(2);
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.isCompleted).toBe(true);

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });

    it('markCompletedで完了状態にできるべき', async () => {
      const { result } = renderHook(() => useCookingPresenter());

      await act(async () => {
        await result.current.fetchRecipe('1');
      });

      act(() => {
        result.current.markCompleted();
      });

      expect(result.current.isCompleted).toBe(true);
    });
  });

  describe('レシピなしの状態', () => {
    it('レシピがない状態でステップ操作しても何も起こらないべき', () => {
      const { result } = renderHook(() => useCookingPresenter());

      const initialState = { ...result.current };

      act(() => {
        result.current.setCurrentStep(1);
      });

      expect(result.current.currentStep).toBe(initialState.currentStep);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(initialState.currentStep);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(initialState.currentStep);
    });
  });
});
