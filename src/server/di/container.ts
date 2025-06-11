import { PrismaClient } from '@prisma/client';
import { CategoryRepository } from '../repositories/implementations/category-repository';
import { RecipeRepository } from '../repositories/implementations/recipe-repository';
import { ICategoryRepository } from '../repositories/interfaces/i-category-repository';
import { IRecipeRepository } from '../repositories/interfaces/i-recipe-repository';
import {
  CategoryService,
  ICategoryService,
} from '../services/category-service';
import { IRecipeService, RecipeService } from '../services/recipe-service';

export class ServerContainer {
  private static instance: ServerContainer;
  private _prismaClient: PrismaClient | null = null;
  private _recipeRepository: IRecipeRepository | null = null;
  private _recipeService: IRecipeService | null = null;
  private _categoryRepository: ICategoryRepository | null = null;
  private _categoryService: ICategoryService | null = null;

  private constructor() {}

  public static getInstance(): ServerContainer {
    if (!ServerContainer.instance) {
      ServerContainer.instance = new ServerContainer();
    }
    return ServerContainer.instance;
  }

  public get prismaClient(): PrismaClient {
    if (!this._prismaClient) {
      this._prismaClient = new PrismaClient();
    }
    return this._prismaClient;
  }

  public get recipeRepository(): IRecipeRepository {
    if (!this._recipeRepository) {
      this._recipeRepository = new RecipeRepository(this.prismaClient);
    }
    return this._recipeRepository;
  }

  public get recipeService(): IRecipeService {
    if (!this._recipeService) {
      this._recipeService = new RecipeService(this.recipeRepository);
    }
    return this._recipeService;
  }

  public get categoryRepository(): ICategoryRepository {
    if (!this._categoryRepository) {
      this._categoryRepository = new CategoryRepository(this.prismaClient);
    }
    return this._categoryRepository;
  }

  public get categoryService(): ICategoryService {
    if (!this._categoryService) {
      this._categoryService = new CategoryService(this.categoryRepository);
    }
    return this._categoryService;
  }

  public async dispose(): Promise<void> {
    if (this._prismaClient) {
      await this._prismaClient.$disconnect();
      this._prismaClient = null;
    }
    this._recipeRepository = null;
    this._recipeService = null;
    this._categoryRepository = null;
    this._categoryService = null;
  }

  // テスト用のメソッド - 依存関係を注入できるようにする
  public setRecipeRepository(repository: IRecipeRepository): void {
    this._recipeRepository = repository;
    this._recipeService = null; // サービスも再初期化が必要
  }

  public setRecipeService(service: IRecipeService): void {
    this._recipeService = service;
  }

  public setCategoryRepository(repository: ICategoryRepository): void {
    this._categoryRepository = repository;
    this._categoryService = null; // サービスも再初期化が必要
  }

  public setCategoryService(service: ICategoryService): void {
    this._categoryService = service;
  }
}
