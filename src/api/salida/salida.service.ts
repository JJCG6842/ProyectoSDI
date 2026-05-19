import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SalidaService {
  private prisma = new PrismaClient();

  async getAllSalidas() {
    return this.prisma.salida.findMany({
      include: {
        user: true,
        detalles: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSalidaPorId(id: string) {
    const salida = await this.prisma.salida.findUnique({
      where: { id },
      include: {
        user: true,
        detalles: {
          include: { product: true },
        },
      },
    });

    if (!salida) throw new NotFoundException('Salida no encontrada');
    return salida;
  }

  async searchByProductName(term: string) {
    if (!term.trim()) throw new BadRequestException('El término de búsqueda no puede estar vacío');

    return this.prisma.salida.findMany({
      where: {
        detalles: {
          some: {
            product: {
              name: { contains: term, mode: 'insensitive' },
            },
          },
        },
      },
      include: {
        user: true,
        detalles: {
          include: { product: true },
        },
      },
    });
  }

  async getSalidasByUser(userId: string) {
    if (!userId) {
      throw new BadRequestException("userId requerido");
    }

    return this.prisma.salida.findMany({
      where: { userId },
      include: {
        user: true,
        detalles: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSalidasByUserName(nombre: string) {
    if (!nombre.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    return this.prisma.salida.findMany({
      where: {
        user: {
          nombre: {
            contains: nombre,
            mode: 'insensitive'
          }
        }
      },
      include: {
        user: true,
        detalles: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async crearSalida(body: any) {
    let { productos, userId } = body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      throw new BadRequestException("Debe enviar al menos un producto");
    }

    return this.prisma.$transaction(async (prisma) => {

      for (const item of productos) {
        const producto = await prisma.products.findUnique({
          where: { id: item.productId },
        });

        if (!producto)
          throw new BadRequestException(`Producto no encontrado: ${item.productId}`);

        if (item.quantity <= 0)
          throw new BadRequestException(`Cantidad inválida para ${producto.name}`);

        if (item.quantity > producto.quantity)
          throw new BadRequestException(`No hay suficiente stock de ${producto.name}`);
      }

      const salida = await prisma.salida.create({
        data: {
          userId: body.userId,
          detalles: {
            create: productos.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          user: true,
          detalles: { include: { product: true } },
        },
      });

      for (const item of productos) {
        const producto = await prisma.products.findUnique({
          where: { id: item.productId },
        });

        const newQuantity = producto!.quantity - item.quantity;

        await prisma.products.update({
          where: { id: item.productId },
          data: {
            quantity: newQuantity,
            status: newQuantity > 0 ? 'Instock' : 'Outstock',
          },
        });
      }

      return salida;
    });
  }

  async eliminarSalida(id: string) {
    const salida = await this.prisma.salida.findUnique({
      where: { id },
      include: { detalles: true }
    });

    if (!salida) {
      throw new NotFoundException('Salida no encontrada');
    }

    const eliminado = await this.prisma.salida.delete({
      where: { id }
    });

    return { message: 'Salida eliminada correctamente', eliminado };
  }

}
