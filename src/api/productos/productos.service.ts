import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaClient, ProductStatus, ProductState } from '@prisma/client';

@Injectable()
export class ProductosService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.products.findMany({
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAllInventory() {
    return this.prisma.products.findMany({
      where: {
        state: ProductState.Habilitado,
      },
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findName(name: string) {
    return this.prisma.products.findMany({
      where: {
        state: ProductState.Habilitado,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findCategoryName(categoryName: string) {
    return this.prisma.products.findMany({
      where: {
        state: ProductState.Habilitado,
        category: {
          name: {
            contains: categoryName,
            mode: 'insensitive',
          },
        },
      },
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findMarca(name: string) {
    return this.prisma.products.findMany({
      where: {
        state: ProductState.Habilitado,
        marca: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      },
      include: {
        almacen: {
          select: {
            id: true,
            nombre: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        marca: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: {
    image: string;
    name: string;
    description: string;
    marcaId?: string;
    quantity: number;
    status?: ProductStatus;
    model: string;
    categoryId: string;
    subcategoryId: string;
  }) {

    const existingProduct = await this.prisma.products.findFirst({
  where: {
    name: {
      equals: data.name,
      mode: 'insensitive',
    },
  },
});

if (existingProduct) {
  throw new BadRequestException(
    'Ya existe un producto con ese nombre',
  );
}

    const almacen = await this.prisma.almacen.findFirst();

    if (!almacen) {
      throw new NotFoundException(
        'No existe un almacén registrado',
      );
    }

    const category = await this.prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    const subcategory = await this.prisma.subcategory.findUnique({
      where: {
        id: data.subcategoryId,
      },
    });

    if (!subcategory) {
      throw new NotFoundException(
        'Subcategoría no encontrada',
      );
    }

    if (data.marcaId) {
      const marca = await this.prisma.marca.findUnique({
        where: {
          id: data.marcaId,
        },
      });

      if (!marca) {
        throw new NotFoundException(
          'Marca no encontrada',
        );
      }
    }

    const status =
      data.quantity > 0
        ? ProductStatus.Instock
        : ProductStatus.Outstock;

    return this.prisma.products.create({
      data: {
        ...data,
        status,
        almacenId: almacen.id,
      },

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      image: string;
      name: string;
      description: string;
      marcaId: string;
      quantity: number;
      status: ProductStatus;
      model: string;
      categoryId: string;
      subcategoryId: string;
    }>,
  ) {
    await this.findOne(id);

    if (data.name) {

  const existingProduct = await this.prisma.products.findFirst({
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

  if (existingProduct) {
    throw new BadRequestException(
      'Ya existe un producto con ese nombre',
    );
  }
}

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          'Categoría no encontrada',
        );
      }
    }

    if (data.subcategoryId) {
      const subcategory =
        await this.prisma.subcategory.findUnique({
          where: {
            id: data.subcategoryId,
          },
        });

      if (!subcategory) {
        throw new NotFoundException(
          'Subcategoría no encontrada',
        );
      }
    }

    if (data.marcaId) {
      const marca = await this.prisma.marca.findUnique({
        where: {
          id: data.marcaId,
        },
      });

      if (!marca) {
        throw new NotFoundException(
          'Marca no encontrada',
        );
      }
    }

    if (data.quantity !== undefined) {
      data.status =
        data.quantity > 0
          ? ProductStatus.Instock
          : ProductStatus.Outstock;
    }

    return this.prisma.products.update({
      where: { id },

      data,

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.products.delete({
      where: { id },
    });
  }

  async findByCategoryId(categoryId: string) {
    return this.prisma.products.findMany({
      where: {
        categoryId,
      },

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }

  async findByMarcaId(marcaId: string) {
    return this.prisma.products.findMany({
      where: {
        marcaId,
      },

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }

  async habilitarProducto(id: string) {
    await this.findOne(id);

    return this.prisma.products.update({
      where: { id },

      data: {
        state: ProductState.Habilitado,
      },
    });
  }

  async deshabilitarProducto(id: string) {
    await this.findOne(id);

    return this.prisma.products.update({
      where: { id },

      data: {
        state: ProductState.Deshabilitado,
      },
    });
  }

  async findByStock(status: ProductStatus) {
    return this.prisma.products.findMany({
      where: {
        status,
      },

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }

  async findByState(state: ProductState) {
    return this.prisma.products.findMany({
      where: {
        state,
      },

      include: {
        almacen: true,
        category: true,
        subcategory: true,
        marca: true,
      },
    });
  }
}

