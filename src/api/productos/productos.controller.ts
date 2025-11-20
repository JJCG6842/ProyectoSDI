import { Controller, Get, Put, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductStatus, ProductState } from '@prisma/client';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productoService: ProductosService) { }

  @Get()
  getAll() {
    return this.productoService.findAll();
  }

  @Get('inventario')
  getAllInventory() {
    return this.productoService.findAllInventory();
  }

  @Get('buscar/nombre/:name')
  findByName(@Param('name') name: string) {
    return this.productoService.findName(name);
  }

  @Get('buscar/categoria/:categoryName')
  findByCategoryName(@Param('categoryName') categoryName: string) {
    return this.productoService.findCategoryName(categoryName);
  }

  @Get('buscar/marca/:marca')
  findByMarca(@Param('marca') marca: string) {
    return this.productoService.findMarca(marca);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @Get('buscar/categoria/id/:id')
  findByCategoryId(@Param('id') id: string) {
    return this.productoService.findByCategoryId(id);
  }

  @Get('filtrar/stock/:status')
  filtrarPorStock(@Param('status') status: ProductStatus) {
    return this.productoService.findByStock(status);
  }

  @Get('filtrar/estado/:state')
  filtrarPorEstado(@Param('state') state: ProductState) {
    return this.productoService.findByState(state);
  }

  @Get('buscar/marca/id/:id')
  findByMarcaId(@Param('id') id: string) {
    return this.productoService.findByMarcaId(id);
  }


  @Post()
  create(
    @Body()
    body: {
      image: string;
      name: string;
      description: string;
      marcaId: string;
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
      image: string;
      name: string;
      description: string;
      marcaId: string;
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

  @Put('habilitar/:id')
  habilitar(@Param('id') id: string) {
    return this.productoService.habilitarProducto(id);
  }

  @Put('deshabilitar/:id')
  deshabilitar(@Param('id') id: string) {
    return this.productoService.deshabilitarProducto(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.delete(id);
  }

}
