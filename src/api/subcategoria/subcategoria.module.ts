import { Module } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { SubcategoriaController } from './subcategoria.controller';

@Module({
  providers: [SubcategoriaService],
  controllers: [SubcategoriaController]
})
export class SubcategoriaModule {}
