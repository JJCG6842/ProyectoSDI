import { Controller,Get,Post,Param,Body,Delete,Put,Patch } from '@nestjs/common';
import { GuiaRemisionService } from './guia_remision.service';
import { GuiaEstado } from '@prisma/client';

@Controller('guia-remision')
export class GuiaRemisionController {

    constructor(private readonly guiaService:GuiaRemisionService) {}

  @Get()
  getAll() {
    return this.guiaService.getAllGuias();
  }

  @Get(':id')
  getOne(@Param('id') id: string) 
  {
    return this.guiaService.getGuiaById(id);
  }

  @Post()
  create(@Body() body: {numero: string;supplierId: string;productos: {productId: string;quantity: number;serialNumbers?: string[]}[];
    }
  ) {
    return this.guiaService.createGuia(body);
  }

  @Post(':id/confirmar')
  confirmar(@Param('id') id: string) {

    return this.guiaService.confirmarGuia(id);
  }

  @Put(':id')
  update(@Param('id') id: string,@Body()
  body: {
    numero: string;
    supplierId: string;
    productos: {
      productId: string;
      quantity: number;
      serialNumbers?: string[];
    }[];
  }
) {
  return this.guiaService.updateGuia(id, body);
}

@Patch(':id')
actualizarEstado(
  @Param('id') id: string,
  @Body()
  body: { estado: GuiaEstado }
) {

  return this.guiaService
    .actualizarEstado(
      id,
      body.estado
    );
}

  @Delete(':id')
  delete(@Param('id') id: string) {
  return this.guiaService.deleteGuia(id);
}

}
