import { Controller, Get, Post, Patch, Delete, Param, Body, Query , Put} from '@nestjs/common';
import { MarcaService } from './marca.service';
import { Prisma } from '@prisma/client';

@Controller('marcas')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Get()
  async findAll() {
    return this.marcaService.findAll();
  }

  @Post()
  async create(@Body() data: Prisma.MarcaCreateInput) {
    return this.marcaService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.MarcaUpdateInput,
  ) {
    return this.marcaService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.marcaService.remove(id);
  }

  @Get('search')
  async searchMarca(@Query('term') term: string) {
    return this.marcaService.findByName(term);
  }

  @Get('filter')
  async findByCategory(@Query('categoryId') categoryId: string) {
    return this.marcaService.findByCategory(categoryId);
  }
}

