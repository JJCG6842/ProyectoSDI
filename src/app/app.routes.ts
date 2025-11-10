import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AlmaceneroComponent } from './components/almacenero/almacenero.component';
import { InicioAlmaceneroComponent } from './pages/almacenero/inicio-almacenero/inicio-almacenero.component';
import { CategoriaAlmaceneroComponent } from './pages/almacenero/categoria-almacenero/categoria-almacenero.component';
import { ProductosAlmaceneroComponent } from './pages/almacenero/productos-almacenero/productos-almacenero.component';
import { AddCategoriaComponent } from './shared/modals-almacenero/add-categoria/add-categoria.component';
import { SubcategoriaAlmaceneroComponent } from './pages/almacenero/subcategoria-almacenero/subcategoria-almacenero.component';
import { AddSubcategoriaComponent } from './shared/modals-almacenero/add-subcategoria/add-subcategoria.component';
import { AddProductoComponent } from './shared/modals-almacenero/add-producto/add-producto.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { ControlInventarioComponent } from './pages/almacenero/control-inventario/control-inventario.component';
import { ProveedorAlmaceneroComponent } from './pages/almacenero/proveedor-almacenero/proveedor-almacenero.component';
import { KardexAlmaceneroComponent } from './pages/almacenero/kardex-almacenero/kardex-almacenero.component';
import { EntradasAlmaceneroComponent } from './pages/almacenero/entradas-almacenero/entradas-almacenero.component';
import { SalidasAlmaceneroComponent } from './pages/almacenero/salidas-almacenero/salidas-almacenero.component';
import { MarcaAlmaceneroComponent } from './pages/almacenero/marca-almacenero/marca-almacenero.component';

import { InicioAdministradorComponent } from './pages/administrador/inicio-administrador/inicio-administrador.component';
import { CategoriaAdministradorComponent } from './pages/administrador/categoria-administrador/categoria-administrador.component';
import { SubcategoriaAdministradorComponent } from './pages/administrador/subcategoria-administrador/subcategoria-administrador.component';
import { ProductosAdministradorComponent } from './pages/administrador/productos-administrador/productos-administrador.component';
import { MarcaAdministradorComponent } from './pages/administrador/marca-administrador/marca-administrador.component';
import { KardexAdministradorComponent } from './pages/administrador/kardex-administrador/kardex-administrador.component';
import { EntradasAdministradorComponent } from './pages/administrador/entradas-administrador/entradas-administrador.component';
import { SalidasAdministradorComponent } from './pages/administrador/salidas-administrador/salidas-administrador.component';
import { ProveedoresAdministradorComponent } from './pages/administrador/proveedores-administrador/proveedores-administrador.component';
import { UsuariosAdministradorComponent } from './pages/administrador/usuarios-administrador/usuarios-administrador.component';
import { ControlInventarioAdministradorComponent } from './pages/administrador/control-inventario-administrador/control-inventario-administrador.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'almacenero',
    component: AlmaceneroComponent,
    children: [
      {
        path: 'inicio-almacenero',
        component: InicioAlmaceneroComponent
      },
      {
        path: 'categoria-almacenero',
        component: CategoriaAlmaceneroComponent
      },
      {
        path: 'subcategoria',
        component: SubcategoriaAlmaceneroComponent
      },
      {
        path: 'marcas',
        component: MarcaAlmaceneroComponent
      },
      {
        path: 'productos-almacenero',
        component: ProductosAlmaceneroComponent
      },
      
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio-almacenero'
      },
      {
        path: 'add-categoria',
        component: AddCategoriaComponent
      },
      {
        path: 'add-subcategoria',
        component: AddSubcategoriaComponent
      },
      {
        path: 'add-producto',
        component: AddProductoComponent
      },
      {
        path: 'panel-inventario',
        component: ControlInventarioComponent
      },
      {
        path: 'proveedor-almacenero',
        component: ProveedorAlmaceneroComponent
      },
      {
        path: 'kardex-almacenero',
        component: KardexAlmaceneroComponent
      },
      {
        path: 'entrada-almacenero',
        component: EntradasAlmaceneroComponent
      },
      {
        path: 'salida-almacenero',
        component: SalidasAlmaceneroComponent
      }
    ]
  },

  { 
    path: 'administrador',
    component: AdministradorComponent,
    children:[
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio-administrador'
      },
      {
        path:'inicio-administrador',
        component:InicioAdministradorComponent
      },
      {
        path: 'categoria-administrador',
        component: CategoriaAdministradorComponent
      },
      {
        path: 'subcategoria-administrador',
        component: SubcategoriaAdministradorComponent
      },
      {
        path: 'marca-administrador',
        component: MarcaAdministradorComponent
      },
      {
        path: 'productos-administrador',
        component: ProductosAdministradorComponent
      },
      {
        path: 'panel-inventario-administrador',
        component: ControlInventarioAdministradorComponent
      },

      {
        path: 'kardex-administrador',
        component: KardexAdministradorComponent
      },
      {
        path: 'entrada-administrador',
        component: EntradasAdministradorComponent
      },
      {
        path: 'salida-administrador',
        component: SalidasAdministradorComponent
      },
      {
        path: 'proveedores-administrador',
        component: ProveedoresAdministradorComponent
      },
      {
        path: 'usuarios-administrador',
        component: UsuariosAdministradorComponent
      }
    ]
  }
];