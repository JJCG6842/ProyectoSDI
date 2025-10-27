import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './api/productos/productos.module';
import { CategoriaModule } from './api/categoria/categoria.module';
import { SubcategoriaModule } from './api/subcategoria/subcategoria.module';
import { UsuarioModule } from './api/usuario/usuario.module';

@Module({
  imports: [CategoriaModule, ProductosModule, SubcategoriaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
