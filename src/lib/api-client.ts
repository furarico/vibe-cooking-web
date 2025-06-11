import type { components, paths } from '@/types/api';
import createClient from 'openapi-fetch';

export type Recipe = components['schemas']['Recipe'];
export type Ingredient = components['schemas']['Ingredient'];
export type Instruction = components['schemas']['Instruction'];

export type RecipesGet200Response = {
  recipes?: Recipe[];
};

export class DefaultApi {
  private client: ReturnType<typeof createClient<paths>>;

  constructor(baseUrl: string = '/api') {
    this.client = createClient<paths>({ baseUrl });
  }

  async recipesGet(): Promise<RecipesGet200Response> {
    const { data, error } = await this.client.GET('/recipes');
    if (error) {
      throw new Error(`API error: ${error}`);
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
    return data.recipe;
  }
}
