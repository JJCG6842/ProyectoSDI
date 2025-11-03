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
  Patch
} from '@nestjs/common';
import { AlmacenesService } from './almacenes.service';

@Controller('almacenes')
export class AlmacenesController {
  constructor(private readonly almacenesService: AlmacenesService) { }

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

  @Get(':id')
  async obtenerAlmacenPorId(@Param('id') id: string) {
    const almacen = await this.almacenesService.findById(id);
    if (!almacen) throw new NotFoundException('Almacén no encontrado');
    return almacen;
  }

  @Get(':id/productos/buscar')
  async buscarProductoEnAlmacen(
    @Param('id') storeId: string,
    @Query('nombre') nombre: string,
  ) {
    if (!nombre) return this.almacenesService.listarProductosPorAlmacen(storeId);

    return this.almacenesService.buscarProductoPorNombre(nombre, storeId);
  }

  @Post()
  async crearAlmacen(@Body() body: { name: string; }) {
    return this.almacenesService.crearAlmacen(body);
  }

  @Post(':storeId/productos/:productId')
  async registrarProductoExistente(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.almacenesService.registrarProductoExistenteEnAlmacen(storeId, productId);
  }

  @Patch('productos/:productId/remover')
  async removerProductoDeAlmacen(@Param('productId') productId: string) {
    return this.almacenesService.removerProductoDeAlmacen(productId);
  }

  @Get('buscar')
  async buscarProductoPorNombre(
    @Query('nombre') nombre: string, @Query('storeId') storeId?: string) {
    return this.almacenesService.buscarProductoPorNombre(nombre, storeId);
  }

  @Delete('productos/:id')
  async descartarProducto(@Param('id') id: string) {
    return this.almacenesService.descartarProductoDeAlmacen(id);
  }

  @Put(':id')
  async editarAlmacen(
    @Param('id') id: string, @Body() body: { name?: string; }) {
    return this.almacenesService.editarAlmacen(id, body);
  }

  @Delete(':id')
  async eliminarAlmacen(@Param('id') id: string) {
    return this.almacenesService.eliminarAlmacen(id);
  }
}