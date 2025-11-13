import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
    constructor(private clienteService: ClienteService){}

@Get()
  getAll() {
    return this.clienteService.findAll();
  }

  @Get('nombre/:name')
  getName(@Param('name') name: string) {
    return this.clienteService.findName(name);
  }

  @Get('buscar/:term')
  search(@Param('term') term: string) {
    return this.clienteService.searchByName(term);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Post()
  create(
    @Body() body: { dni:number; name:string; phone: number },
  ) {
    return this.clienteService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,@Body() body: { dni?:number; name?:string; phone?: number },) {
    return this.clienteService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteService.delete(id);
  }
}
