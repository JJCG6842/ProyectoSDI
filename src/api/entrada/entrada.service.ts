import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, TipoEntrada } from '@prisma/client';

@Injectable()
export class EntradaService {
  private prisma = new PrismaClient();

  async getAllEntradas() {
    return this.prisma.entrance.findMany({
      include: {
        detalles: {
          include: {
            product: { select: { id: true, name: true, price: true, categoryId: true } },
          },
        },
        supplier: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEntradaPorId(id: string) {
    const entrada = await this.prisma.entrance.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            product: { select: { id: true, name: true, price: true, categoryId: true } },
          },
        },
        supplier: { select: { id: true, name: true } },
      },
    });
    if (!entrada) throw new NotFoundException('Entrada no encontrada');
    return entrada;
  }

  async createEntrada(data: {
    tipoentrada: TipoEntrada;   
    supplierId?: string;
    clienteId?: string;
    productos: { productId: string; quantity: number; price: number }[];
  }) {
    if (!data.productos?.length)
      throw new BadRequestException('Debe enviar al menos un producto');

    if (!Object.values(TipoEntrada).includes(data.tipoentrada)) {
      throw new BadRequestException(
        `TipoEntrada inválido. Valores permitidos: ${Object.values(TipoEntrada).join(', ')}`
      );
    }

    const productIds = data.productos.map(p => p.productId);
    const productos = await this.prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    if (productos.length !== data.productos.length)
      throw new NotFoundException('Uno o más productos no encontrados');

    const entrada = await this.prisma.entrance.create({
      data: {
        tipoentrada: data.tipoentrada,  
        supplierId: data.supplierId || null,
        clienteId: data.clienteId || null,
        detalles: {
          create: data.productos.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
            total: p.quantity * p.price,
          })),
        },
      },
      include: { detalles: true },
    });

    for (const p of data.productos) {
      const producto = productos.find(pr => pr.id === p.productId);
      if (producto) {
        await this.prisma.products.update({
          where: { id: p.productId },
          data: {
            quantity: producto.quantity + p.quantity,
            status: 'Instock',
          },
        });
      }
    }

    return entrada;
  }

  async deleteEntrada(id: string) {
    const entrada = await this.prisma.entrance.findUnique({ where: { id } });
    if (!entrada) throw new NotFoundException('Entrada no encontrada');

    await this.prisma.entrance.delete({ where: { id } });
    return { message: 'Entrada eliminada correctamente' };
  }

}
