import { Injectable , NotFoundException} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class ProductosService {
    private prisma = new PrismaClient();

    async findAll(){
        return this.prisma.products.findMany({
        });
    }

    async findOne(id:number){
        const product = await this.prisma.products.findUnique({
            where: {id},
        });
        if(!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async create(data:{
        SKU: string;
        image: string;
        name: string;
        marca: string;
        price: number;
        categoryId: number;
    }){ 
        return this.prisma.products.create({data});
    }

    async update(id: number, data:Partial<{
        SKU: string;
        image: string;
        name: string;
        marca: string;
        price: number;
        categoryId: number;
    }>){
        await this.findOne(id);
        return this.prisma.products.update({
            where:{id},
            data,
        });
    }

    async delete(id: number) {
        await this.findOne(id);
        return this.prisma.products.delete({where:{id}});
    }
    
}
