import { Category, PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../interfaces/i-category-repository';

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }
}
