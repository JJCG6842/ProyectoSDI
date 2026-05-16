import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AlmacenService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.almacen.findMany({
      include: {
        products: true,
      },
    });
  }

  async findOne(id: string) {
    const almacen = await this.prisma.almacen.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!almacen) {
      throw new NotFoundException('Almacén no encontrado');
    }

    return almacen;
  }

  async create(data: {
    nombre: string;
    descripcion: string;
    direccion: string;
    telefono: string;
  }) {
    const existe = await this.prisma.almacen.count();

    if (existe > 0) {
      throw new BadRequestException(
        'Solo puede existir un almacén',
      );
    }

    return this.prisma.almacen.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{
      nombre: string;
      descripcion: string;
      direccion: string;
      telefono: string;
    }>,
  ) {
    await this.findOne(id);

    return this.prisma.almacen.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.almacen.delete({
      where: { id },
    });
  }
}