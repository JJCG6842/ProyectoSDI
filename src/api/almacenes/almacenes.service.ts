import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AlmacenesService {
  private prisma = new PrismaClient();

  // ✅ Crear un almacén
  async crearAlmacen(data: { name: string; }) {
    return await this.prisma.store.create({ data });
  }

  async findAll() {
    return await this.prisma.store.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async listarProductosPorAlmacen(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: {
          include: {
            category: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!store) throw new NotFoundException('El almacén no existe');
    return store;
  }

  async agregarProductoAlmacen(
    storeId: string,
    data: {
      name: string;
      description: string;
      marca: string;
      price: number;
      quantity: number;
      model: string;
      categoryId: string;
      subcategoryId: string;
      image: string;
    },
  ) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('El almacén especificado no existe');

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: data.subcategoryId },
    });
    if (!subcategory) throw new NotFoundException('Subcategoría no encontrada');

    return await this.prisma.products.create({
      data: {
        name: data.name,
        description: data.description,
        marca: data.marca,
        price: data.price,
        quantity: data.quantity,
        status: data.quantity > 0 ? 'Instock' : 'Outstock',
        model: data.model,
        image: data.image,
        category: { connect: { id: data.categoryId } },
        subcategory: { connect: { id: data.subcategoryId } },
        store: { connect: { id: storeId } },
      },
    });
  }

  async buscarProductoPorNombre(nombre: string, storeId?: string) {
    const filtro: any = {
      name: { contains: nombre, mode: 'insensitive' },
    };
    if (storeId) filtro.storeId = storeId;

    return await this.prisma.products.findMany({
      where: filtro,
      include: {
        store: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
      },
    });
  }

  async descartarProductoDeAlmacen(productId: string) {
    const producto = await this.prisma.products.findUnique({ where: { id: productId } });
    if (!producto) throw new NotFoundException('El producto no existe o ya fue eliminado');

    return await this.prisma.products.delete({
      where: { id: productId },
    });
  }

  async editarAlmacen(
    id: string,
    data: { name?: string;},
  ) {
    const almacen = await this.prisma.store.findUnique({ where: { id } });
    if (!almacen) throw new NotFoundException('El almacén no existe');

    return await this.prisma.store.update({
      where: { id },
      data,
    });
  }

  async eliminarAlmacen(id: string) {
    const almacen = await this.prisma.store.findUnique({ where: { id } });
    if (!almacen) throw new NotFoundException('El almacén no existe');

    return await this.prisma.store.delete({
      where: { id },
    });
  }
}
