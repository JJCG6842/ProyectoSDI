import { Controller , Get, Post, Put, Delete, Param, Body, ParseIntPipe} from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
    constructor(private categoriaService: CategoriaService){}

    @Get()
    getAll(){
        return this.categoriaService.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.categoriaService.findOne(id);
    }

    @Post()
    create(@Body() body: {name: string; description: string}){
        return this.categoriaService.create(body);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id:number,
        @Body() body: {name?: string; description?: string },
    ) {
        return this.categoriaService.update(id, body);
    }

    
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:number) {
        return this.categoriaService.delete(id);
    }
}
