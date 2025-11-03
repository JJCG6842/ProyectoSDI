import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AlmacenesService } from './almacenes.service';

@Controller('almacenes')
export class AlmacenesController {
  constructor(private readonly almacenesService: AlmacenesService) {}

  @Get()
  async listarAlmacenes() {
    return this.almacenesService.findAll();
  }

  @Get(':id/productos')
  async listarProductosPorAlmacen(@Param('id') id: string) {
    const result = await this.almacenesService.listarProductosPorAlmacen(id);
    if (!result) throw new NotFoundException('Almacén no encontrado');
    return result;
  }

  @Post()
  async crearAlmacen(@Body() body: { name: string;}) {
    return this.almacenesService.crearAlmacen(body);
  }

  @Post(':id/productos')
  async agregarProductoAAlmacen(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      description: string;
      marca: string;
      price: number;
      quantity: number;
      model: string;
      categoryId: string;
      subcategoryId: string;
      image: string;
    },
  ) {
    return this.almacenesService.agregarProductoAlmacen(id, body);
  }

  @Get('buscar')
  async buscarProductoPorNombre(
    @Query('nombre') nombre: string,@Query('storeId') storeId?: string) {
    return this.almacenesService.buscarProductoPorNombre(nombre, storeId);
  }

  @Delete('productos/:id')
  async descartarProducto(@Param('id') id: string) {
    return this.almacenesService.descartarProductoDeAlmacen(id);
  }

  @Put(':id')
  async editarAlmacen(
    @Param('id') id: string,@Body() body: { name?: string;}) {
    return this.almacenesService.editarAlmacen(id, body);
  }

  @Delete(':id')
  async eliminarAlmacen(@Param('id') id: string) {
    return this.almacenesService.eliminarAlmacen(id);
  }
}