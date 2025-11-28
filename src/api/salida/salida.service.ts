import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, TipoSalida } from '@prisma/client';

@Injectable()
export class SalidaService {
  private prisma = new PrismaClient();

  async getAllSalidas() {
    return this.prisma.salida.findMany({
      include: {
        supplier: true,
        cliente: true,
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
        supplier: true,
        cliente: true,
        detalles: {
          include: { product: true },
        },
      },
    });

    if (!salida) throw new NotFoundException('Salida no encontrada');
    return salida;
  }

  async filtrarSalidas(filtros: {
    clienteId?: string;
    supplierId?: string;
    tiposalida?: string;
    categoryId?: string;
    categoryName?: string;
  }) {

    const { clienteId, supplierId, categoryId, categoryName } = filtros;
    let { tiposalida } = filtros;

    if (tiposalida && !Object.values(TipoSalida).includes(tiposalida as TipoSalida)) {
      throw new BadRequestException(
        `TipoSalida inválido. Valores permitidos: ${Object.values(TipoSalida).join(', ')}`
      );
    }

    const enumTipoSalida = tiposalida ? (tiposalida as TipoSalida) : undefined;

    return this.prisma.salida.findMany({
      where: {
        ...(clienteId && { clienteId }),
        ...(supplierId && { supplierId }),
        ...(enumTipoSalida && { tiposalida: enumTipoSalida }),
        ...(categoryId && {
        detalles: {
          some: {
            product: {
              categoryId: categoryId
            }
          }
        }
      }),
      ...(categoryName && {
        detalles: {
          some: {
            product: {
              category: {
                name: { contains: categoryName, mode: 'insensitive' }
              }
            }
          }
        }
      })
      },
      include: {
        supplier: true,
        cliente: true,
        detalles: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
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
        supplier: true,
        cliente: true,
        detalles: {
          include: { product: true },
        },
      },
    });
  }

  async crearSalida(body: any) {
    let { tipo, tiposalida, supplierId, clienteId, productos } = body;

    supplierId = supplierId || null;
    clienteId = clienteId || null;

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
          tipo,
          tiposalida,
          supplierId,
          clienteId,
          detalles: {
            create: productos.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
        },
        include: {
          supplier: true,
          cliente: true,
          detalles: { include: { product: true } },
        },
      });

      for (const item of productos) {
        const producto = await prisma.products.findUnique({
          where: { id: item.productId },
        });

        if (!producto) {
          throw new BadRequestException(`Producto no encontrado: ${item.productId}`);
        }

        const newQuantity = producto.quantity - item.quantity;

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
