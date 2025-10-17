import { Controller, Get, Put, Post, Delete, Param, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productoService: ProductosService) {}

  @Get()
  getAll() {
    return this.productoService.findAll();
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
