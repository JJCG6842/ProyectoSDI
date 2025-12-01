import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.supplier.create({ data });
  }
 
  async update(
    id: string,
    data: { name?: string; phone?: number; description?: string, ruc?: string, address?: string },
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
