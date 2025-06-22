import type { components, paths } from '@/types/api';
import { getToken } from 'firebase/app-check';
import createClient, { Middleware } from 'openapi-fetch';
import { appCheck } from './firebase';
import { admin } from './firebase-admin';

export type Recipe = components['schemas']['Recipe'];
export type Ingredient = components['schemas']['Ingredient'];
export type Instruction = components['schemas']['Instruction'];
export type Category = components['schemas']['Category'];
export type VibeRecipe = components['schemas']['VibeRecipe'];

export type RecipesGet200Response = {
  recipes?: Recipe[];
};

export type CategoriesGet200Response = {
  categories?: Category[];
};

export type VibeRecipePostRequest = {
  recipeIds: string[];
};

// Client-side App Check token function
const getClientAppCheckToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !appCheck) {
    return null;
  }
  try {
    const appCheckToken = await getToken(appCheck);
    return appCheckToken.token;
  } catch (error) {
    console.error('Client App Check token error:', error);
    return null;
  }
};

// Server-side App Check token function (dynamic import to avoid bundling in client)
const getServerAppCheckToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    return null;
  }
  try {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!appId) {
      console.error('NEXT_PUBLIC_FIREBASE_APP_ID is not set');
      return null;
    }
    const appCheckToken = await admin.appCheck().createToken(appId);
    return appCheckToken.token;
  } catch (error) {
    console.error('Server App Check token error:', error);
    return null;
  }
};

const getAppCheckToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    return getClientAppCheckToken();
  } else {
    return getServerAppCheckToken();
  }
};

const appCheckInterceptor: Middleware = {
  async onRequest({ request }) {
    try {
      const appCheckToken = await getAppCheckToken();
      if (!appCheckToken) {
        return request;
      }
      const bearerToken = `Bearer ${appCheckToken}`;
      request.headers.set('X-Firebase-AppCheck', bearerToken);
      return request;
    } catch (error) {
      console.error('App Check interceptor error:', error);
      return request;
    }
  },
};

export class DefaultApi {
  private client: ReturnType<typeof createClient<paths>>;

  constructor(baseUrl: string = '/api') {
    this.client = createClient<paths>({ baseUrl });
    this.client.use(appCheckInterceptor);
  }

  async recipesGet(params?: {
    q?: string;
    tag?: string;
    category?: string;
    categoryId?: string;
  }): Promise<RecipesGet200Response> {
    const { data, error } = await this.client.GET('/recipes', {
      params: { query: params },
    });
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }

  async recipesIdGet(id: string): Promise<Recipe> {
    const { data, error } = await this.client.GET('/recipes/{id}', {
      params: { path: { id } },
    });
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }

  async categoriesGet(): Promise<CategoriesGet200Response> {
    const { data, error } = await this.client.GET('/categories');
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }

  async vibeRecipePost(request: VibeRecipePostRequest): Promise<VibeRecipe> {
    const { data, error } = await this.client.POST('/vibe-recipe', {
      body: request,
    });
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }
}

export const createApiClient = (baseUrl: string = '/api') => {
  const client = createClient<paths>({ baseUrl });
  client.use(appCheckInterceptor);

  async function recipesGet(params?: {
    q?: string;
    tag?: string;
    category?: string;
    categoryId?: string;
  }): Promise<RecipesGet200Response> {
    try {
      const { data, error } = await client.GET('/recipes', {
        params: { query: params },
      });
      if (error) {
        console.error(error);
        throw error;
      }
      if (!data) {
        throw new Error('No data received from API');
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function recipesIdGet(id: string): Promise<Recipe> {
    try {
      const { data, error } = await client.GET('/recipes/{id}', {
        params: { path: { id } },
      });
      if (error) {
        console.error(error);
        throw error;
      }
      if (!data) {
        throw new Error('No data received from API');
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function categoriesGet(): Promise<CategoriesGet200Response> {
    const { data, error } = await client.GET('/categories');
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }

  async function vibeRecipePost(
    request: VibeRecipePostRequest
  ): Promise<VibeRecipe> {
    const { data, error } = await client.POST('/vibe-recipe', {
      body: request,
    });
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }

  return {
    recipesGet,
    recipesIdGet,
    categoriesGet,
    vibeRecipePost,
  };
};
