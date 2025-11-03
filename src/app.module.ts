import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './api/productos/productos.module';
import { CategoriaModule } from './api/categoria/categoria.module';
import { SubcategoriaModule } from './api/subcategoria/subcategoria.module';
import { UsuarioModule } from './api/usuario/usuario.module';
import { ProveedoresModule } from './api/proveedores/proveedores.module';
import { AlmacenesModule } from './api/almacenes/almacenes.module';

@Module({
  imports: [CategoriaModule, ProductosModule, SubcategoriaModule, UsuarioModule,ProveedoresModule, AlmacenesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
