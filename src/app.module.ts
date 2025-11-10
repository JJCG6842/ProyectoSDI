import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './api/productos/productos.module';
import { CategoriaModule } from './api/categoria/categoria.module';
import { SubcategoriaModule } from './api/subcategoria/subcategoria.module';
import { UsuarioModule } from './api/usuario/usuario.module';
import { ProveedoresModule } from './api/proveedores/proveedores.module';
import { MarcaModule } from './api/marca/marca.module';
import { EntradaModule } from './api/entrada/entrada.module';
import { SalidaModule } from './api/salida/salida.module';
import { KardexModule } from './api/kardex/kardex.module';


@Module({
  imports: [CategoriaModule, ProductosModule, SubcategoriaModule, UsuarioModule,ProveedoresModule,MarcaModule, EntradaModule, SalidaModule, KardexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
