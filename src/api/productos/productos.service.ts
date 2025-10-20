import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductosService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.products.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
        subcategory: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
      },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async findName (name: string){
    return this.prisma.products.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        },
      },
      include: {
        category: {select: {id: true, name:true}},
        subcategory: {select: {id: true, name:true}}
      }
    });
  }

  async findCategoryName(categoryName: string) {
  return this.prisma.products.findMany({
    where: {
      category: {
        name: {
          contains: categoryName,
          mode: 'insensitive',
        },
      },
    },
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
    },
  });
}


  async findMarca(marca: string) {
  return this.prisma.products.findMany({
    where: {
      marca: {
        contains: marca,
        mode: 'insensitive',
      },
    },
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
    },
  });
}


  async create(data: {
    partnumber: string;
    image: string;
    name: string;
    marca: string;
    price: number;
    model: string;
    categoryId: string;
    subcategoryId: string;
  }) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: data.subcategoryId },
    });
    if (!subcategory) throw new NotFoundException('Subcategoría no encontrada');

    return this.prisma.products.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      partnumber: string;
      image: string;
      name: string;
      marca: string;
      price: number;
      model: string;
      categoryId: string;
      subcategoryId: string;
    }>,
  ) {
    await this.findOne(id);

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new NotFoundException('Categoría no encontrada');
    }

    if (data.subcategoryId) {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: { id: data.subcategoryId },
      });
      if (!subcategory)
        throw new NotFoundException('Subcategoría no encontrada');
    }

    return this.prisma.products.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.products.delete({ where: { id } });
  }
}
