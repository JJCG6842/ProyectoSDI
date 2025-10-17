import { Controller , Get, Post, Put, Delete, Param, Body} from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';

@Controller('subcategoria')
export class SubcategoriaController {
    constructor(private subcategoriaservice: SubcategoriaService){}

    @Get()
    getAll(){
        return this.subcategoriaservice.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id:string){
        return this.subcategoriaservice.findOne(id);
    }

    @Post()
    create(@Body() body:{name: string; description: string; categoryId: string}){
        return this.subcategoriaservice.create(body);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() body:{name?: string; description?: string; categoryId?: string}){
        return this.subcategoriaservice.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id:string){
        return this.subcategoriaservice.delete(id);
    }
}
