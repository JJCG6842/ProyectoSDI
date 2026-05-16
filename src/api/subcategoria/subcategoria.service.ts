import { Injectable , NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubcategoriaService {
    private prisma = new PrismaClient();

    async findAll() {
        return this.prisma.subcategory.findMany({
            include: {
                categories: {
                select: {
                    id: true,
                    name: true
                }
                }
            }
        });
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

    async findByCategoryId(categoryId: string) {
        return this.prisma.subcategory.findMany({
        where: {
            categories: {
                some: {
                    id: categoryId
                }
            }
        },

    include: {
      categories: true
    }
  });
}

    async searchByName(term:string){
        const subcategory = await this.prisma.subcategory.findMany({
            where: {
                name:{ contains: term, mode:'insensitive'},
            },
            include:{categories: {select: {id:true, name:true},},products:true},
        });

        if(subcategory.length === 0){
            throw new NotFoundException(`No se encontraron subcategorías con: ${term}`);
        }

        return subcategory;
    }

    async findOne(id: string) {
  const subcategory = await this.prisma.subcategory.findUnique({
    where: { id },

        include: {
            categories: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

  if (!subcategory) {
    throw new NotFoundException('Subcategory not found');
  }

  return subcategory;
}

    async create(data:{ name:string; description: string; categoryIds: string[];}){

    const existingSubcategory = await this.prisma.subcategory.findFirst({
        where: {
            name: {
                equals: data.name,
                mode: 'insensitive'
            }
        }
    });

    if (existingSubcategory) {
        throw new BadRequestException('La subcategoría ya existe');
    }

        const categories = await this.prisma.category.findMany({
            where: { id: { in:data.categoryIds}},
        });

        if (categories.length !== data.categoryIds.length) {
            throw new NotFoundException('Una o más categorías no existen');
        }

        return this.prisma.subcategory.create({
            data: {
                name: data.name,
                description: data.description,

            categories: {
                connect: data.categoryIds.map(id => ({ id }))
            }
        },

        include: {
            categories: true
        }
  });
}

    async update(id: string, data: { name?: string; description?: string; categoryIds?: string[] }){
        await this.findOne(id);

        if (data.name) {

        const existingSubcategory = await this.prisma.subcategory.findFirst({
            where: {
                AND: [
                    { NOT: { id } },
                    {
                        name: {
                            equals: data.name,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        if (existingSubcategory) {
            throw new BadRequestException('La subcategoría ya existe');
        }
    }

        if (data.categoryIds){
            const categories = await this.prisma.category.findMany({
                where: {id: {in: data.categoryIds}}
            });

            if (categories.length !== data.categoryIds.length) {
                throw new NotFoundException('Una o más categorías no existen');
            }
        }

        return this.prisma.subcategory.update({
            where: { id },

            data: {
                name: data.name,
                description: data.description,

                ...(data.categoryIds && {
                    categories: {
                    set: [],
                    connect: data.categoryIds.map(id => ({ id }))
                }
            })
        },

        include: {
            categories: true
        }
    });;
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
                categories: { select: { id: true, name: true } }, 
                products: true, 
            },
  });

  if (marcas.length === 0) {
    throw new NotFoundException(`No se encontraron marcas con: ${term}`);
  }

  return marcas;
}
}
