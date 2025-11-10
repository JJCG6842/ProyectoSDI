import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SalidaService {
  private prisma = new PrismaClient();

  async getAllSalidas() {
    return this.prisma.salida.findMany({
      include: {
        product: { select: { id: true, name: true, quantity: true, price: true } },
        supplier: { select: { id: true, name: true, phone: true, description: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSalidaPorId(id: string) {
    const salida = await this.prisma.salida.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, quantity: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    if (!salida) {
      throw new NotFoundException('Salida no encontrada');
    }

    return salida;
  }

  async createSalida(data: { productId: string; quantity: number; supplierId?: string }) {
    if (data.quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a cero');
    }

    const producto = await this.prisma.products.findUnique({
      where: { id: data.productId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.quantity < data.quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Cantidad disponible: ${producto.quantity}`,
      );
    }

    const salida = await this.prisma.salida.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        supplierId: data.supplierId,
      },
    });

    const nuevoStock = producto.quantity - data.quantity;

    await this.prisma.products.update({
      where: { id: data.productId },
      data: {
        quantity: nuevoStock,
        status: nuevoStock > 0 ? 'Instock' : 'Outstock',
      },
    });

    return salida;
  }

  async deleteSalida(id: string) {
  const salida = await this.prisma.salida.findUnique({
    where: { id },
  });

  if (!salida) {
    throw new NotFoundException('Salida no encontrada');
  }

  await this.prisma.salida.delete({
    where: { id },
  });

  return { message: 'Salida eliminada correctamente' };
}
}