import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AlmacenesService {
  private prisma = new PrismaClient();

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

  async findById(id: string) {
    const almacen = await this.prisma.store.findUnique({ where: { id } });
    if (!almacen) return null;
    return almacen;
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

  async registrarProductoExistenteEnAlmacen(storeId: string, productId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('El almacén especificado no existe');

    const producto = await this.prisma.products.findUnique({ where: { id: productId } });
    if (!producto) throw new NotFoundException('El producto no existe');

    return this.prisma.products.update({
      where: { id: productId },
      data: { storeId },
    });
  }

  async removerProductoDeAlmacen(productId: string) {
    const producto = await this.prisma.products.findUnique({ where: { id: productId } });
    if (!producto) throw new NotFoundException('El producto no existe');

    return await this.prisma.products.update({
      where: { id: productId },
      data: { storeId: null },
    });
  }

  async buscarProductoPorNombreEnAlmacen(storeId: string, nombre: string) {

    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('El almacén no existe');

    return await this.prisma.products.findMany({
      where: {
        storeId: storeId,
        name: {
          contains: nombre,
          mode: 'insensitive',
        },
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
    data: { name?: string; },
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
