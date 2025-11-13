import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ClienteService {
    private prisma = new PrismaClient();

    async findAll() {
    return this.prisma.cliente.findMany({});
    }

    async findOne(id:string){
        const cliente = await this.prisma.cliente.findUnique({
            where: {id}
        });

        if (!cliente) throw new NotFoundException('Cliente no encontrado');
        return cliente;
    }

    async findName(name: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (!cliente) throw new NotFoundException(`No se encontró el cliente: ${name}`);
    return cliente;
  }

    async searchByName(term: string) {
    const cliente = await this.prisma.cliente.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
    });

    if (cliente.length === 0)
      throw new NotFoundException(`No se encontraron clientes con: ${term}`);

    return cliente;
  }

  async create(data: { dni: number; name: string; phone: number }) {

    return this.prisma.cliente.create({
      data: {
        dni: Number(data.dni),
        name: data.name,
        phone: Number(data.phone),
      },
    });
  }

  async update(id: string, data: {dni?:number; name?:string; phone?: number}){
    await this.findOne(id);
    return this.prisma.cliente.update({
        where: {id},
        data
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.cliente.delete({where: {id}});
  }

}
