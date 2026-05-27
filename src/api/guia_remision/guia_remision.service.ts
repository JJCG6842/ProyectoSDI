import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaClient,GuiaEstado,ProductStatus } from '@prisma/client';

@Injectable()
export class GuiaRemisionService {

  private prisma = new PrismaClient();

  async getAllGuias() {

    return this.prisma.guiaRemision.findMany({

      include: {

        supplier: true,

        detalles: {

          include: {
            product: true,
            serialNumbers: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getGuiaById(id: string) {

    const guia =
      await this.prisma.guiaRemision.findUnique({

        where: { id },

        include: {

          supplier: true,

          detalles: {

            include: {
              product: true,
              serialNumbers: true
            }
          }
        }
      });

    if (!guia) {

      throw new NotFoundException(
        'Guía no encontrada'
      );
    }

    return guia;
  }

  async createGuia(data: {

    numero: string;
    supplierId: string;
    productos: {
      productId: string;
      quantity: number;
      serialNumbers?: string[];
    }[];

  }) {

    if (!data.productos?.length) {
      throw new BadRequestException('Debe enviar productos');
    }

    const supplier =
      await this.prisma.supplier.findUnique({

        where: {
          id: data.supplierId
        }
      });

    if (!supplier) {

      throw new NotFoundException('Proveedor no encontrado');
    }

    const guiaExiste =
      await this.prisma.guiaRemision.findUnique({

        where: {
          numero: data.numero
        }
      });

    if (guiaExiste) {
      throw new BadRequestException('La guía ya existe');
    }

    const productIds =
      data.productos.map(
        p => p.productId
      );

    const productosDB =
      await this.prisma.products.findMany({

        where: {
          id: {
            in: productIds
          }
        }
      });

    if (
      productosDB.length !== data.productos.length
    ) {
      throw new NotFoundException('Uno o más productos no existen');
    }

    for (const p of data.productos) {

      if (
  p.serialNumbers &&
  p.serialNumbers.length > 0
) {

  if (
    p.serialNumbers.length !== p.quantity
  ) {

    throw new BadRequestException(
      `Las series no coinciden con la cantidad del producto ${p.productId}`
    );
  }

  const set =
    new Set(p.serialNumbers);

  if (
    set.size !==
    p.serialNumbers.length
  ) {

    throw new BadRequestException(
      `Series duplicadas en el producto ${p.productId}`
    );
  }
}
    }

    return this.prisma.guiaRemision.create({

      data: {
        numero: data.numero,
        supplierId: data.supplierId,
        estado: GuiaEstado.PENDIENTE,
        detalles: {
          create:
            data.productos.map(p => ({
              productId: p.productId,
              cantidad: p.quantity,
              serialNumbers:
                p.serialNumbers?.length
                  ? {
                      create:
                        p.serialNumbers.map(
                          s => ({
                            serial: s
                          })
                        )
                    }
                  : undefined
            }))
        }
      },

      include: {
        supplier: true,
        detalles: {
          include: {
            product: true,
            serialNumbers: true
          }
        }
      }
    });
  }

  async updateGuia(id: string,
  data: {
    numero: string;
    supplierId: string;
    productos: {
      productId: string;
      quantity: number;
      serialNumbers?: string[];
    }[];
  }
) {

  const guia = await this.prisma.guiaRemision.findUnique({
    where: { id },
    include: {
      detalles: {
        include: {
          serialNumbers: true
        }
      }
    }
  });

  if (!guia) {
    throw new NotFoundException(
      'Guía no encontrada'
    );
  }

  if (guia.estado !== GuiaEstado.PENDIENTE) {
    throw new BadRequestException(
      'Solo se pueden editar guías pendientes'
    );
  }

  const supplier =
    await this.prisma.supplier.findUnique({
      where: {
        id: data.supplierId
      }
    });

  if (!supplier) {
    throw new NotFoundException(
      'Proveedor no encontrado'
    );
  }

  const numeroExiste =
    await this.prisma.guiaRemision.findFirst({
      where: {
        numero: data.numero,
        NOT: {
          id
        }
      }
    });

  if (numeroExiste) {
    throw new BadRequestException(
      'Ya existe una guía con ese número'
    );
  }

  const productIds =
    data.productos.map(
      p => p.productId
    );

  const productosDB =
    await this.prisma.products.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

  if (
    productosDB.length !==
    data.productos.length
  ) {
    throw new NotFoundException(
      'Uno o más productos no existen'
    );
  }

  for (const p of data.productos) {
    if (p.serialNumbers && p.serialNumbers.length !== p.quantity
    ) {
      throw new BadRequestException(`Las series no coinciden con la cantidad del producto ${p.productId}`);
    }

    if (p.serialNumbers) {

      const set = new Set(p.serialNumbers);

      if (set.size !== p.serialNumbers.length
      ) {
        throw new BadRequestException(`Series duplicadas en producto ${p.productId}`);
      }
    }
  }

  return this.prisma.$transaction(async (prisma) => {

    await prisma.guiaRemisionDetalle.deleteMany({
      where: {
        guiaId: id
      }
    });

    const guiaActualizada =
      await prisma.guiaRemision.update({
        where: { id },
        data: {
          numero: data.numero,
          supplierId: data.supplierId,
          detalles: {
            create:
              data.productos.map(p => ({
                productId: p.productId,
                cantidad: p.quantity,
                serialNumbers:
                  p.serialNumbers?.length
                    ? {
                        create:
                          p.serialNumbers.map(
                            s => ({
                              serial: s
                            })
                          )
                      }
                    : undefined
              }))
          }
        },
        include: {
          supplier: true,
          detalles: {
            include: {
              product: true,
              serialNumbers: true
            }
          }
        }
      });

    return guiaActualizada;
  });
}

async actualizarEstado(
  id: string,
  estado: GuiaEstado
) {

  const guia =
    await this.prisma.guiaRemision.update({
      where: { id },
      data: {
        estado
      }
    });
  return guia;

}

async confirmarGuia(id: string) {
  const guia = await this.prisma.guiaRemision.findUnique({
    where: { id },
    include: {
      detalles: {
        include: { serialNumbers: true }
      }
    }
  });

  if (!guia) {
    throw new NotFoundException('Guía no encontrada');
  }

  if (guia.estado !== GuiaEstado.PENDIENTE) {
    throw new BadRequestException('Solo se pueden confirmar guías pendientes');
  }

  return this.prisma.$transaction(async (prisma) => {

    const entrada = await prisma.entrance.create({
      data: {
        supplierId: guia.supplierId,
        guiaId: guia.id,
        detalles: {
          create: guia.detalles.map(d => ({
            productId: d.productId,
            quantity: d.cantidad,
            serialNumbers: d.serialNumbers?.length
              ? {
                  create: d.serialNumbers.map(s => ({
                    serial: s.serial
                  }))
                }
              : undefined
          }))
        }
      },
      include: {
        detalles: true
      }
    });

    for (const d of guia.detalles) {

      await prisma.products.update({
        where: { id: d.productId },
        data: {
          quantity: {
            increment: d.cantidad
          },
          status: ProductStatus.Instock
        }
      });
    }

    await prisma.guiaRemision.update({
      where: { id },
      data: {
        estado: GuiaEstado.RECIBIDO
      }
    });

    return entrada;
  });
}

async deleteGuia(id: string) {
  const guia =
    await this.prisma.guiaRemision.findUnique({
      where: { id }
    });

  if (!guia) {

    throw new NotFoundException('Guía no encontrada');
  }

  if (
    guia.estado === GuiaEstado.RECIBIDO
  ) {

    throw new BadRequestException('No se puede eliminar una guía confirmada');
  }

  await this.prisma.guiaRemision.delete({
    where: { id }
  });

  return {
    message:
      'Guía eliminada correctamente'
  };
}
}

