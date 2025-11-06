import { Injectable , NotFoundException} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubcategoriaService {
    private prisma = new PrismaClient();

    async findAll(){
        return this.prisma.subcategory.findMany({
            include: {category:{select:{id: true, name: true,}}}
        })
    }

    async findName(name: string){
        const subcategory = await this.prisma.subcategory.findFirst({
            where:{name: {equals: name , mode:'insensitive'}},
            include: {products: true},
        });

        if(!subcategory){
            throw new NotFoundException (`No se encontró la subcategoría con nombre: ${name}`)
        }
        return subcategory;
    }

    async searchByName(term:string){
        const subcategory = await this.prisma.subcategory.findMany({
            where: {
                name:{ contains: term, mode:'insensitive'},
            },
            include:{category: {select: {id:true, name:true},},products:true},
        });

        if(subcategory.length === 0){
            throw new NotFoundException(`No se encontraron subcategorías con: ${term}`);
        }

        return subcategory;
    }

    async findOne(id: string){
        const subcategory = await this.prisma.subcategory.findUnique({where:{id},
            include: {category:{select:{id: true, name: true}}} 
        });

        if (!subcategory) {throw new NotFoundException('Subcategory not found');}
        return subcategory;
    }

    async create(data:{ name:string; description: string; categoryId: string}){
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId},
        });

        if (!category){
            throw new NotFoundException('No hay categoria')
        }

        return this.prisma.subcategory.create({data});
    }

    async update(id: string, data: { name?: string; description?: string; categoryId?: string }){
        await this.findOne(id);

        if (data.categoryId){
            const category = await this.prisma.category.findUnique({
                where: {id: data.categoryId},
            });
            if(!category) throw new NotFoundException('No hay categoria');
        }

        return this.prisma.subcategory.update({where:{id},data});
    }

    async delete(id: string){
        await this.findOne(id);
        return this.prisma.subcategory.delete({where: {id}});
    }

    async searchMarcaByName(term: string) {
        const marcas = await this.prisma.marca.findMany({
            where: {
                name: { contains: term, mode: 'insensitive' }, 
            },
            include: {
                category: { select: { id: true, name: true } }, 
                products: true, 
            },
  });

  if (marcas.length === 0) {
    throw new NotFoundException(`No se encontraron marcas con: ${term}`);
  }

  return marcas;
}
}
