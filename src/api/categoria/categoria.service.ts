import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriaService {
    private prisma = new PrismaClient();

    async findAll() {
        return this.prisma.category.findMany({
        });
    }

    async findOne(id: number){
        const category = await this.prisma.category.findUnique({
            where: {id},
        });
        if (!category) throw new NotFoundException('category not found');
        return category;
    }

    async create(data: {name :string; description: string}){
        return this.prisma.category.create({data});
    }

    async update(id: number, data: { name?: string; description?: string}){
        await this.findOne(id);
        return this.prisma.category.update({
            where: {id},
            data,
        });
    }

    async delete(id:number){
        await this.findOne(id);
        return this.prisma.category.delete({where: {id}})
    }
}
