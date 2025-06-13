import { RecipeRepository } from '@/client/repositories/implementations/recipe-repository';
import {
  MediaRecorderSpeechRepository,
  SpeechRecognitionRepository,
  WebSpeechRecognitionRepository,
} from '@/client/repositories/speech-recognition-repository';
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
  voiceCookingService: VoiceCookingService;
  speechRecognitionRepository: SpeechRecognitionRepository;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const recipeRepository = new RecipeRepository(apiClient);

  // 音声認識リポジトリの作成（Web Speech API優先、フォールバックでMediaRecorder）
  const speechRecognitionRepository: SpeechRecognitionRepository =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
      ? new WebSpeechRecognitionRepository()
      : new MediaRecorderSpeechRepository();

  // Service の作成
  const recipeService = new RecipeService(recipeRepository);
  const voiceCookingService = new VoiceCookingServiceImpl({
    speechRecognitionRepository,
    recipeService,
  });

  return {
    prisma,
    recipeService,
    voiceCookingService,
    speechRecognitionRepository,
  };
};
