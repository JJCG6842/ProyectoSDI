import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EntradaService {
  private prisma = new PrismaClient();

  async getAllEntradas() {
    return this.prisma.entrance.findMany({
      include: {
        detalles: {
          include: {
            product: { select: { id: true, name: true, categoryId: true } },
            serialNumbers: true
          },
        },
        supplier: { select: { id: true, name: true, phone: true } },
        guia: { select: { id: true, numero: true }
      }
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
            product: { select: { id: true, name: true, categoryId: true } },
            serialNumbers: true
          },
        },
        supplier: { select: { id: true, name: true } },
        guia: {
        select: {id: true,numero: true}
      }
      },
    });

    if (!entrada) throw new NotFoundException('Entrada no encontrada');

    return entrada;
  }

  async createEntrada(data: {
  supplierId?: string;
  guiaId?: string;
  productos: {
    productId: string;
    quantity: number;
    serialNumbers?: string[];
  }[];
}) {

  if (!data.productos?.length) {
    throw new BadRequestException('Debe enviar al menos un producto');
  }

  const productIds = data.productos.map(
    p => p.productId
  );

  const productosDB =
    await this.prisma.products.findMany({
      where: { id: { in: productIds } },
    });

  if (productosDB.length !== data.productos.length) {
    throw new NotFoundException('Uno o más productos no existen');
  }

  for (const p of data.productos) {

    if (p.serialNumbers && !Array.isArray(p.serialNumbers)
    ) {
      throw new BadRequestException(`Los números de serie de ${p.productId} no tienen formato válido`);
    }

    if (p.quantity > 1 && (!p.serialNumbers || p.serialNumbers.length === 0)
    ) {
      throw new BadRequestException(`Debe enviar números de serie para el producto ${p.productId}`);
    }

    if (p.serialNumbers && p.serialNumbers.length !== p.quantity
    ) {
      throw new BadRequestException(`La cantidad (${p.quantity}) no coincide con los números de serie enviados (${p.serialNumbers.length}) para el producto ${p.productId}`);
    }

    if (data.guiaId && !data.supplierId) {
      throw new BadRequestException('La entrada por guía requiere proveedor');
}

    if (p.serialNumbers) {

      const set = new Set(p.serialNumbers);

      if (set.size !== p.serialNumbers.length) {
        throw new BadRequestException(`Hay números de serie duplicados para el producto ${p.productId}`);
      }
    }

    if (p.serialNumbers && p.serialNumbers.length
    ) {

      const existentes =
        await this.prisma.serialNumber.findMany({
          where: {
            serial: {
              in: p.serialNumbers
            }
          },
          select: {
            serial: true
          }
        });

      if (existentes.length > 0) {
        throw new BadRequestException(`Los siguientes números de serie ya existen: ${existentes
            .map(e => e.serial)
            .join(', ')}`
        );
      }
    }
  }

  const entrada =
    await this.prisma.$transaction(
      async prisma => {

        const entradaCreada =
          await prisma.entrance.create({
            data: {
              supplierId:
                data.supplierId ?? null,

                guiaId: data.guiaId ?? null,

              detalles: {
                create: data.productos.map(
                  p => ({
                    productId: p.productId,
                    quantity: p.quantity,

                    serialNumbers:
                      p.serialNumbers?.length
                        ? {
                            create:
                              p.serialNumbers.map(
                                sn => ({
                                  serial: sn
                                })
                              )
                          }
                        : undefined,
                  })
                ),
              },
            },

            include: {
              detalles: true
            },
          });

        for (const p of data.productos) {
          const prodActual =
            productosDB.find(
              x => x.id === p.productId
            )!;

          await prisma.products.update({
            where: { id: p.productId },

            data: {
              quantity:
                {
                  increment: p.quantity
                },

              status: 'Instock',
            },
          });
        }

        return entradaCreada;
      }
    );

  return entrada;
}

  async deleteEntrada(id: string) {
    const entrada = await this.prisma.entrance.findUnique({ where: { id } });
    if (!entrada) throw new NotFoundException('Entrada no encontrada');

    await this.prisma.entrance.delete({ where: { id } });
    return { message: 'Entrada eliminada correctamente' };
  }
}