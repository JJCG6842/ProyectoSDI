import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Query } from '@nestjs/common';
import { SalidaService } from './salida.service';

@Controller('salida')
export class SalidaController {
  constructor(private readonly salidaService: SalidaService) { }

  @Get()
  listarSalidas() {
    return this.salidaService.getAllSalidas();
  }

  @Get(':id')
  obtenerSalida(@Param('id') id: string) {
    return this.salidaService.getSalidaPorId(id);
  }

  @Get('filtrar')
  async filtrarSalidas(
    @Query('clienteId') clienteId?: string,
    @Query('supplierId') supplierId?: string,
    @Query('tiposalida') tiposalida?: string,
    @Query('categoryId') categoryId?: string,
    @Query('categoryName') categoryName?: string,
  ) {
    return this.salidaService.filtrarSalidas({ clienteId, supplierId, tiposalida, categoryId, categoryName });
  }

  @Get('buscar/producto/:term')
  buscarPorProducto(@Param('term') term: string) {
    return this.salidaService.searchByProductName(term);
  }


  @Post()
  async crearSalida(@Body() body: any) {
    return this.salidaService.crearSalida(body);
  }

  @Delete(':id')
  async eliminarSalida(@Param('id') id: string) {
    const salida = await this.salidaService.eliminarSalida(id);
    if (!salida) {
      throw new NotFoundException('Salida no encontrada');
    }
    return {
      message: 'Salida eliminada correctamente',
      salida
    };
  }
}