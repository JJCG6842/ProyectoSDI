import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma, Marca } from '@prisma/client';

@Injectable()
export class MarcaService {
  private prisma = new PrismaClient();

  async findAll(): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      include: {
        categories: true,
        products: true,
      },
    });
}

  async getMarcasPorCategoria(categoryId: string): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },

      include: {
        products: true,
        categories: true,
      },
    });
}

  async create(data: {name: string;description: string;categoryIds: string[];}): Promise<Marca> {

  const existingMarca = await this.prisma.marca.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: 'insensitive',
      },
    },
  });

  if (existingMarca) {
    throw new BadRequestException('La marca ya existe');
  }

  const categories = await this.prisma.category.findMany({
    where: {
      id: {
        in: data.categoryIds,
      },
    },
  });

  if (categories.length !== data.categoryIds.length) {
    throw new Error('Una o más categorías no existen');
  }

  return this.prisma.marca.create({
    data: {
      name: data.name,
      description: data.description,

      categories: {
        connect: data.categoryIds.map(id => ({ id })),
      },
    },

    include: {
      categories: true,
    },
  });
}

  async update(id: string,data: {name?: string;description?: string;categoryIds?: string[];}): Promise<Marca> {

  if (data.name) {

    const existingMarca = await this.prisma.marca.findFirst({
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

    if (existingMarca) {
      throw new BadRequestException('La marca ya existe');
    }
  }

  if (data.categoryIds) {

    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: data.categoryIds,
        },
      },
    });

    if (categories.length !== data.categoryIds.length) {
      throw new Error('Una o más categorías no existen');
    }
  }

  return this.prisma.marca.update({
    where: { id },

    data: {
      name: data.name,
      description: data.description,

      ...(data.categoryIds && {
        categories: {
          set: [],
          connect: data.categoryIds.map(id => ({ id })),
        },
      }),
    },

    include: {
      categories: true,
    },
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

      include: {
        categories: true,
        products: true,
      },
    });
}

  async findByCategory(categoryId: string): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },

      include: {
        categories: true,
        products: true,
      },
    });
  }
}
