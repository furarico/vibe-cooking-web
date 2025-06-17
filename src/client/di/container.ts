import { CategoryRepository } from '@/client/repositories/implementations/category-repository';
import { RecipeRepository } from '@/client/repositories/implementations/recipe-repository';
import {
  MediaRecorderSpeechRepository,
  WebSpeechRecognitionRepository,
} from '@/client/repositories/implementations/speech-recognition-repository';
import { SpeechRecognitionRepository } from '@/client/repositories/interfaces/i-speech-recognition-repository';
import {
  AudioPlayerService,
  AudioPlayerServiceImpl,
} from '@/client/services/audio-player-service';
import {
  AudioRecognitionService,
  AudioRecognitionServiceImpl,
} from '@/client/services/audio-recognition-service';
import { CategoryService } from '@/client/services/category-service';
import { RecipeListService } from '@/client/services/recipe-list-service';
import { RecipeService } from '@/client/services/recipe-service';
import { DefaultApi } from '@/lib/api-client';
import { VibeCookingService } from '../services/vibe-cooking-service';
import { LocalStorageRepository } from '../repositories/implementations/local-storage-repository';

export interface DIContainer {
  audioPlayerService: AudioPlayerService;
  audioRecognitionService: AudioRecognitionService;
  categoryService: CategoryService;
  recipeListService: RecipeListService;
  recipeService: RecipeService;
  vibeCookingService: VibeCookingService;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const categoryRepository = new CategoryRepository(apiClient);
  const localStorageRepository = new LocalStorageRepository();
  const recipeRepository = new RecipeRepository(apiClient);

  // 音声認識リポジトリの作成（Web Speech API優先、フォールバックでMediaRecorder）
  const speechRecognitionRepository: SpeechRecognitionRepository =
    typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
      ? new WebSpeechRecognitionRepository()
      : new MediaRecorderSpeechRepository();

  // Service の作成
  const audioPlayerService = new AudioPlayerServiceImpl();
  const audioRecognitionService = new AudioRecognitionServiceImpl(
    speechRecognitionRepository
  );
  const categoryService = new CategoryService(categoryRepository);
  const recipeListService = new RecipeListService(recipeRepository);
  const recipeService = new RecipeService(recipeRepository);
  const vibeCookingService = new VibeCookingService(localStorageRepository);

  return {
    audioPlayerService,
    audioRecognitionService,
    categoryService,
    recipeListService,
    recipeService,
    vibeCookingService,
  };
};
