export interface ICategoryRepository {
  findAll(): Promise<import('@/lib/api-client').Category[]>;
}
