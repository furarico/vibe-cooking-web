import type { components, paths } from '@/types/api';
import { getToken } from 'firebase/app-check';
import createClient, { Middleware } from 'openapi-fetch';
import { appCheck } from './firebase';

export type Recipe = components['schemas']['Recipe'];
export type Ingredient = components['schemas']['Ingredient'];
export type Instruction = components['schemas']['Instruction'];

export type RecipesGet200Response = {
  recipes?: Recipe[];
};

const appCheckInterceptor: Middleware = {
  async onRequest({ request }) {
    try {
      if (typeof window !== 'undefined') {
        if (!appCheck) {
          console.warn('Firebase App Check is not initialized');
          return request;
        }
        const appCheckToken = await getToken(appCheck);
        const bearerToken = `Bearer ${appCheckToken.token}`;
        request.headers.set('Authorization', bearerToken);
        console.log(
          'AppCheck token set:',
          bearerToken.substring(0, 20) + '...'
        );
        return request;
      }
      return request;
    } catch (error) {
      console.error('AppCheck error:', error);
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

  async recipesGet(): Promise<RecipesGet200Response> {
    const { data, error } = await this.client.GET('/recipes');
    if (error) {
      throw new Error(`API error: ${error}`);
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
      throw new Error(`API error: ${error}`);
    }
    if (!data) {
      throw new Error('No data received from API');
    }
    return data;
  }
}
