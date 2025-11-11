import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EntradaService {
    private prisma = new PrismaClient();

    async getAllEntradas() {
    return this.prisma.entrance.findMany({
      include: {
        product: { select: { id: true, name: true, quantity: true, price: true } },
        supplier: { select: { id: true, name: true, phone: true, description: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEntradaPorId(id: string) {
    const entrada = await this.prisma.entrance.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, quantity: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    if (!entrada) {
      throw new NotFoundException('Entrada no encontrada');
    }

    return entrada;
  }

  async searchByProductName(term: string) {
  if (!term.trim()) {
    throw new BadRequestException('El término de búsqueda no puede estar vacío');
  }

  return this.prisma.entrance.findMany({
    where: {
      product: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
    },
    include: {
      product: { select: { id: true, name: true, price: true, quantity: true } },
      supplier: { select: { id: true, name: true, phone: true, description: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

  async createEntrada(data: {
    productId: string;
    quantity: number;
    supplierId?: string;
  }) {
    if (data.quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a cero');
    }

    const producto = await this.prisma.products.findUnique({
      where: { id: data.productId },
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const entrada = await this.prisma.entrance.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        supplierId: data.supplierId,
      },
    });

    await this.prisma.products.update({
      where: { id: data.productId },
      data: {
        quantity: producto.quantity + data.quantity,
        status: 'Instock',
      },
    });

    return entrada;
  }

  async deleteEntrada(id: string) {
    const entrada = await this.prisma.entrance.findUnique({
      where: { id },
    });

    if (!entrada) {
      throw new NotFoundException('Entrada no encontrada');
    }

    await this.prisma.entrance.delete({
      where: { id },
    });

    return { message: 'Entrada eliminada correctamente' };
  }

}
