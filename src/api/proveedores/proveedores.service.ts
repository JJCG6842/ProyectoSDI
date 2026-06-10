import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProveedoresService {
  private prisma = new PrismaClient();


  async findAll() {
    return this.prisma.supplier.findMany({
    });
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      
    });

    if (!supplier) throw new NotFoundException('Proveedor no encontrado');
    return supplier;
  }


  async findName(name: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (!supplier) throw new NotFoundException(`No se encontró el proveedor: ${name}`);
    return supplier;
  }


  async searchByName(term: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
    });

    if (suppliers.length === 0)
      throw new NotFoundException(`No se encontraron proveedores con: ${term}`);

    return suppliers;
  }

  async create(data: { name: string; phone: number; description: string , ruc: string, address: string}) {

    const existingSupplier = await this.prisma.supplier.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: data.name,
            mode: 'insensitive',
          },
        },
        {
          ruc: data.ruc,
        },
        {
          phone: data.phone,
        },
      ],
    },
  });

  if (existingSupplier) {

    if (existingSupplier.name.toLowerCase() === data.name.toLowerCase()
    ) {
      throw new BadRequestException('El proveedor ya existe');
    }

    if (existingSupplier.ruc === data.ruc) {
      throw new BadRequestException('El RUC ya está registrado');
    }

    if (existingSupplier.phone === data.phone) {
      throw new BadRequestException('El teléfono ya está registrado');
    }
  }

    return this.prisma.supplier.create({ data });
  }
 
  async update(
    id: string,
    data: { name?: string; phone?: number; description?: string, ruc?: string, address?: string },
  ) {
    await this.findOne(id);

    const existingSupplier = await this.prisma.supplier.findFirst({
    where: {
      AND: [
        { NOT: { id } },
        {
          OR: [
            data.name
              ? {
                  name: {
                    equals: data.name,
                    mode: 'insensitive',
                  },
                }
              : {},

            data.ruc
              ? {
                  ruc: data.ruc,
                }
              : {},

            data.phone
              ? {
                  phone: data.phone,
                }
              : {},
          ],
        },
      ],
    },
  });

  if (existingSupplier) {

    if ( data.name && existingSupplier.name.toLowerCase() === data.name.toLowerCase()
    ) {
      throw new BadRequestException('El proveedor ya existe');
    }

    if (data.ruc && existingSupplier.ruc === data.ruc
    ) {
      throw new BadRequestException('El RUC ya está registrado');
    }

    if (data.phone && existingSupplier.phone === data.phone
    ) {
      throw new BadRequestException('El teléfono ya está registrado');
    }
  }

    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.supplier.delete({ where: { id } });
  }
}
