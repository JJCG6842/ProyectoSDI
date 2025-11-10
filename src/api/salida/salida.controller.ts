import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { SalidaService } from './salida.service';

@Controller('salida')
export class SalidaController {
  constructor(private readonly salidaService: SalidaService) {}

  @Get()
  listarSalidas() {
    return this.salidaService.getAllSalidas();
  }

  @Get(':id')
  obtenerSalida(@Param('id') id: string) {
    return this.salidaService.getSalidaPorId(id);
  }

  @Post()
  crearSalida(
    @Body()
    body: {
      productId: string;
      quantity: number;
      supplierId?: string;
    },
  ) {
    return this.salidaService.createSalida(body);
  }

  @Delete(':id')
  eliminarSalida(@Param('id') id: string) {
    return this.salidaService.deleteSalida(id);
  }
}