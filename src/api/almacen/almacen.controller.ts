import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { AlmacenService } from './almacen.service';

@Controller('almacen')
export class AlmacenController {
  constructor(private readonly almacenService: AlmacenService) {}

  @Get()
  getAll() {
    return this.almacenService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.almacenService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      nombre: string;
      descripcion: string;
      direccion: string;
      telefono: string;
    },
  ) {
    return this.almacenService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      nombre: string;
      descripcion: string;
      direccion: string;
      telefono: string;
    }>,
  ) {
    return this.almacenService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.almacenService.delete(id);
  }
}