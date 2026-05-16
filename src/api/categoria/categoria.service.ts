import { Injectable, NotFoundException, BadRequestException,} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriaService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.category.findMany({
      include: {subcategories: true,products: true,marcas:true},
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, 
    include: { subcategories: true, products: true,marcas:true} });
    if (!category) throw new NotFoundException('No hay categoria');
    return category;
  }

  async findName(name: string) {
    const category = await this.prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive'}},
      include: {subcategories: true, products: true,marcas:true},
    });

    if (!category) {
      throw new NotFoundException(`No se encontró la categoría con nombre: ${name}`);}
      return category;
  }

  async searchByName(term: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: term, mode: 'insensitive' },
      },
      include: { subcategories: true, products: true, marcas:true },
    });

    if (categories.length === 0) {
      throw new NotFoundException(`No se encontraron categorías con: ${term}`);
    }

    return categories;
  }
  

  async create(data: { name: string; description: string }) {
    const existingCategory = await this.prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: 'insensitive',
      },
    },
  });

  if (existingCategory) {
    throw new BadRequestException('La categoría ya existe');
  }
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    await this.findOne(id);

    if (data.name) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        AND: [
          { NOT: { id } },
          {
            name: {
              equals: data.name,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    if (existingCategory) {
      throw new BadRequestException('La categoría ya existe');
    }
  }
  
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