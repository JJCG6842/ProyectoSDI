import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProveedoresService {
  private prisma = new PrismaClient();


  async findAll() {
    return this.prisma.supplier.findMany({
      include: {
        entrances: {
          include: {
            product: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
          },
        },
      },
    });
  }


  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        entrances: {
          include: {
            product: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!supplier) throw new NotFoundException('Proveedor no encontrado');
    return supplier;
  }


  async findName(name: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: { entrances: true },
    });

    if (!supplier) throw new NotFoundException(`No se encontró el proveedor: ${name}`);
    return supplier;
  }


  async searchByName(term: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      include: { entrances: true },
    });

    if (suppliers.length === 0)
      throw new NotFoundException(`No se encontraron proveedores con: ${term}`);

    return suppliers;
  }


  async create(data: { name: string; phone: number; description: string }) {
    return this.prisma.supplier.create({ data });
  }

 
  async update(
    id: string,
    data: { name?: string; phone?: number; description?: string },
  ) {
    await this.findOne(id);
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
