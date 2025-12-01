import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no existente o no encontrado');
    return user;
  }

  async findName(nombre: string) {
    const user = await this.prisma.users.findFirst({
      where: { nombre: { equals: nombre, mode: 'insensitive' } },
    });
    if (!user) throw new NotFoundException(`No se encontró el usuario: ${nombre}`);
    return user;
  }

  async searchByName(term: string) {
    const user = await this.prisma.users.findMany({
      where: { nombre: { contains: term, mode: 'insensitive' } },
    });
    if (user.length === 0)
      throw new NotFoundException(`No se encontró el usuario con: ${term}`);
    return user;
  }

  // async findByDni(dni: number) {
  //   const user = await this.prisma.users.findFirst({
  //     where: { dni },
  //   });
  //   return user;
  // }

  async createUser(data: { nombre: string; lastname: string; email: string; dni: number; password: string; role?: Role }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.users.create({
      data: {
        nombre: data.nombre,
        lastname: data.lastname,
        email: data.email,
        dni: data.dni,
        password: hashedPassword,
        role: data.role ?? Role.Almacenero,
      },
      select: { id: true, nombre: true, lastname: true, email: true, dni: true, role: true, createdAt: true },
    });
  }


  async updateUser(
    id: string,
    data: Partial<{ nombre: string; lastname: string; email: string; dni: number; password: string; role: Role }>,
  ) {
    await this.findOne(id);

    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.users.update({
      where: { id },
      data: updateData,
      select: { id: true, nombre: true, lastname: true, email: true, dni: true, role: true, updatedAt: true },
    });
  }

  async deleteUser(id: string) {
    await this.findOne(id);
    return this.prisma.users.delete({ where: { id } });
  }

  async enableUser(id: string) {
    await this.findOne(id);

    return this.prisma.users.update({
      where: { id },
      data: { status: UserStatus.Habilitado },
      select: {
        id: true,
        nombre: true,
        lastname: true,
        email: true,
        dni: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async disableUser(id: string) {
    await this.findOne(id);

    return this.prisma.users.update({
      where: { id },
      data: { status: UserStatus.Deshabilitado },
      select: {
        id: true,
        nombre: true,
        lastname: true,
        email: true,
        dni: true,
        status: true,
        updatedAt: true,
      },
    });
  }


  async verifyPassword(nombre: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        nombre,
      }
    });

    if (!user) throw new NotFoundException('Usuario no encontrado con los datos proporcionados');

    if (user.status === UserStatus.Deshabilitado) {
      throw new UnauthorizedException('El usuario está deshabilitado');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new NotFoundException('Contraseña incorrecta');

    return { message: 'Login correcto', user };
  }

  async findByStatus(status: UserStatus) {
    return this.prisma.users.findMany({
      where: { status },
    });
  }
}
