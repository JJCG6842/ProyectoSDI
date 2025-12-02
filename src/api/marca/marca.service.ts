import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Marca } from '@prisma/client';

@Injectable()
export class MarcaService {
  private prisma = new PrismaClient();

  // Ver todas las marcas
  async findAll(): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      include: {
        category: true,
        products: true,
      },
    });
  }

  async getMarcasPorCategoria(categoryId: string): Promise<Marca[]> {
  return this.prisma.marca.findMany({
    where: { categoryId },
    include: { products: true },
  });
}

  async create(data: Prisma.MarcaCreateInput): Promise<Marca> {
    return this.prisma.marca.create({ data });
  }

  async update(id: string, data: Prisma.MarcaUpdateInput): Promise<Marca> {
    return this.prisma.marca.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Marca> {
    return this.prisma.marca.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: { category: true },
    });
  }

  async findByCategory(categoryId: string): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: { categoryId },
      include: { products: true },
    });
  }
}
