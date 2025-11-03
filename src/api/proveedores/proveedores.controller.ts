import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private proveedoresService: ProveedoresService) {}

  @Get()
  getAll() {
    return this.proveedoresService.findAll();
  }

  @Get('nombre/:name')
  getName(@Param('name') name: string) {
    return this.proveedoresService.findName(name);
  }

  @Get('buscar/:term')
  search(@Param('term') term: string) {
    return this.proveedoresService.searchByName(term);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(id);
  }

  @Post()
  create(
    @Body() body: { name: string; phone: number; description: string },
  ) {
    return this.proveedoresService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; phone?: number; description?: string },
  ) {
    return this.proveedoresService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedoresService.delete(id);
  }
}
