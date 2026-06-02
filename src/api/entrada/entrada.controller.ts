import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { EntradaService } from './entrada.service';

@Controller('entrada')
export class EntradaController {

  constructor(private readonly entradasService: EntradaService) {}

  @Get()
  listarEntradas() {
    return this.entradasService.getAllEntradas();
  }

  @Get(':id')
  obtenerEntrada(@Param('id') id: string) {
    return this.entradasService.getEntradaPorId(id);
  }

  @Post()
  crearEntrada(
    @Body() body: {
  supplierId?: string;
  guiaId?: string;

  productos: {
    productId: string;
    quantity: number;
    serialNumbers?: string[];
  }[];
},
  ) {
    return this.entradasService.createEntrada(body);
  }

  @Delete(':id')
  eliminarEntrada(@Param('id') id: string) {
    return this.entradasService.deleteEntrada(id);
  }
}
