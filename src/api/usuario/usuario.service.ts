import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    private prisma = new PrismaClient();

    async findAll(){
        return this.prisma.users.findMany();
    }

    async findOne(id: string) {
        const user = await this.prisma.users.findUnique({where: {id}});
        if(!user) throw new NotFoundException('Usuario no existente o no encontrado');
        return user;
    }

    async createUser(data: {nombre: string; password: string; role?: Role}){
        

        return this.prisma.users.create({
            data: {
                nombre: data.nombre,
                password: data.password,
                role: data.role ?? Role.Almacenero,
            },
            select: {id: true, nombre: true, role: true, createdAt: true},
        });
    }

    async updateUser(
        id: string,
        data: Partial<{nombre: string; password: string; role: Role}>,
    ){
        await this.findOne(id);

        const updateData: any = {...data};

        // if (data.password){
        //     updateData.password = await bcrypt.hash(data.password,10);
        // }

        return this.prisma.users.update({
            where: { id },
            data: updateData,
            select: { id: true, nombre: true, role: true, updatedAt: true },
        });
    }

    async deleteUser(id: string) {
        await this.findOne(id);
        return this.prisma.users.delete({ where: { id } });
    }

    async verifyPassword(nombre: string, password: string) {
        const user = await this.prisma.users.findFirst({ where: { nombre } });
            if (!user) throw new NotFoundException('Usuario no encontrado');

        const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new NotFoundException('Contraseña incorrecta');

        return { message: 'Login correcto', user };
    }
}
