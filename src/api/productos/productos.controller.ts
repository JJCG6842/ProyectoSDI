import { Controller, Get, Put, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductStatus } from '@prisma/client';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productoService: ProductosService) {}

  @Get()
  getAll() {
    return this.productoService.findAll();
  }

  @Get('buscar/nombre/:name')
  findByName(@Param('name') name: string) {
    return this.productoService.findName(name);
  }

  @Get('buscar/categoria/:categoryName')
  findByCategoryName(@Param('categoryName') categoryName: string) {
    return this.productoService.findCategoryName(categoryName);
  }

  @Get('buscar/partnumber/:partnumber')
  findByPartnumber(@Param('partnumber') partnumber: string) {
    return this.productoService.findPartnumber(partnumber);
  }

  @Get('buscar/marca/:marca')
  findByMarca(@Param('marca') marca: string) {
    return this.productoService.findMarca(marca);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      partnumber: string;
      image: string;
      name: string;
      marca: string;
      price: number;
      quantity: number;
      status: ProductStatus;
      model: string;
      categoryId: string;
      subcategoryId: string;
    },
  ) {
    return this.productoService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      partnumber: string;
      image: string;
      name: string;
      marca: string;
      price: number;
      quantity: number;
      status: ProductStatus;
      model: string;
      categoryId: string;
      subcategoryId: string;
    }>,
  ) {
    return this.productoService.update(id, body);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.delete(id);
  }

}
