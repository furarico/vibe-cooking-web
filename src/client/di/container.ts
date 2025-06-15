import { CategoryRepository } from '@/client/repositories/implementations/category-repository';
import { RecipeRepository } from '@/client/repositories/implementations/recipe-repository';
import {
  MediaRecorderSpeechRepository,
  SpeechRecognitionRepository,
  WebSpeechRecognitionRepository,
} from '@/client/repositories/speech-recognition-repository';
import {
  AudioPlayerService,
  AudioPlayerServiceImpl,
} from '@/client/services/audio-player-service';
import { CategoryService } from '@/client/services/category/category-service';
import { RecipeListService } from '@/client/services/recipe-list/recipe-list-service';
import { RecipeService } from '@/client/services/recipe/recipe-service';
import {
  VoiceCookingService,
  VoiceCookingServiceImpl,
} from '@/client/services/voice-cooking-service';
import { DefaultApi } from '@/lib/api-client';
import { prisma } from '@/lib/database';

export interface DIContainer {
  prisma: typeof prisma;
  recipeService: RecipeService;
  categoryService: CategoryService;
  recipeListService: RecipeListService;
  voiceCookingService: VoiceCookingService;
  speechRecognitionRepository: SpeechRecognitionRepository;
  audioPlayerService: AudioPlayerService;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const recipeRepository = new RecipeRepository(apiClient);
  const categoryRepository = new CategoryRepository(apiClient);

  // 音声認識リポジトリの作成（Web Speech API優先、フォールバックでMediaRecorder）
  const speechRecognitionRepository: SpeechRecognitionRepository =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
      ? new WebSpeechRecognitionRepository()
      : new MediaRecorderSpeechRepository();

  // Service の作成
  const recipeService = new RecipeService(recipeRepository);
  const categoryService = new CategoryService(categoryRepository);
  const recipeListService = new RecipeListService(recipeRepository);
  const audioPlayerService = new AudioPlayerServiceImpl();
  const voiceCookingService = new VoiceCookingServiceImpl({
    speechRecognitionRepository,
    recipeService,
    audioPlayerService,
  });

  return {
    prisma,
    recipeService,
    categoryService,
    recipeListService,
    voiceCookingService,
    speechRecognitionRepository,
    audioPlayerService,
  };
};
