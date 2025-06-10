import type { components } from '@/types/api';

export type Recipe = components['schemas']['Recipe'];
export type Ingredient = components['schemas']['Ingredient'];
export type Instruction = components['schemas']['Instruction'];

export type RecipesGet200Response = {
  recipes?: Recipe[];
};

export class DefaultApi {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async recipesGet(): Promise<RecipesGet200Response> {
    const response = await fetch(`${this.baseUrl}/recipes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async recipesIdGet(id: string): Promise<Recipe> {
    const response = await fetch(`${this.baseUrl}/recipes/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.recipe;
  }
}
