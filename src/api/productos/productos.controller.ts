import { Controller , Get, Put, Post, Delete, Param, Body, ParseIntPipe} from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
    constructor(private productoService: ProductosService){}

    @Get()
    getAll(){
        return this.productoService.findAll()
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.productoService.findOne(id)
    }

    @Post()
    create(
        @Body()
        body:{
        SKU: string;
        image: string;
        name: string;
        marca: string;
        price: number;
        categoryId: number;
        },
    ){
        return this.productoService.create(body);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: Partial<{
            SKU: string;
            image: string;
            name: string;
            marca: string;
            price: number;
            categoryId: number
        }>,
    ) {
        return this.productoService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:number){
        return this.productoService.delete(id);
    }
}
