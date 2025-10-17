import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriaService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.category.findMany({
      include: {subcategories: true,products: true,},
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, 
    include: { subcategories: true, products: true,} });
    if (!category) throw new NotFoundException('No hay categoria');
    return category;
  }

  async create(data: { name: string; description: string }) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}