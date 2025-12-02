import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Query } from '@nestjs/common';
import { SalidaService } from './salida.service';

@Controller('salida')
export class SalidaController {
  constructor(private readonly salidaService: SalidaService) { }

  @Get()
  listarSalidas() {
    return this.salidaService.getAllSalidas();
  }

  @Get('buscar/producto/:term')
  buscarPorProducto(@Param('term') term: string) {
    return this.salidaService.searchByProductName(term);
  }

  @Get(':id')
  obtenerSalida(@Param('id') id: string) {
    return this.salidaService.getSalidaPorId(id);
  }

  @Get('usuario/:userId')
  getSalidasPorUsuario(@Param('userId') userId: string) {
    return this.salidaService.getSalidasByUser(userId);
  }

  @Get('buscar/usuario/:nombre')
  buscarPorNombreUsuario(@Param('nombre') nombre: string) {
    return this.salidaService.getSalidasByUserName(nombre);
  }

  @Get('destino/:destinoId')
  async getSalidasByDestino(@Param('destinoId') destinoId: string) {
    return this.salidaService.getSalidasByDestino(destinoId);
  }

  @Post()
  async crearSalida(@Body() body: any) {
    return this.salidaService.crearSalida(body);
  }

  @Delete(':id')
  async eliminarSalida(@Param('id') id: string) {
    const salida = await this.salidaService.eliminarSalida(id);

    return {
      message: 'Salida eliminada correctamente',
      salida: salida,
    };
  }
}