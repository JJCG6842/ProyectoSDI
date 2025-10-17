import { Controller , Get, Post, Put, Delete, Param, Body} from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
    constructor(private categoriaService: CategoriaService){}

    @Get()
    getAll(){
        return this.categoriaService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id:string){
        return this.categoriaService.findOne(id);
    }

    @Post()
    create(@Body() body: {name: string; description: string}){
        return this.categoriaService.create(body);
    }

    @Put(':id')
    update(
        @Param('id') id:string,@Body() body: {name?: string; description?: string }) {
        return this.categoriaService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.categoriaService.delete(id);
    }
}
