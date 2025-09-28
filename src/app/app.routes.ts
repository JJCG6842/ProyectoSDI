import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AlmaceneroComponent } from './components/almacenero/almacenero.component';
import { InicioAlmaceneroComponent } from './pages/almacenero/inicio-almacenero/inicio-almacenero.component';
import { CategoriaAlmaceneroComponent } from './pages/almacenero/categoria-almacenero/categoria-almacenero.component';
import { ProductosAlmaceneroComponent } from './pages/almacenero/productos-almacenero/productos-almacenero.component';

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
        path: 'productos-almacenero',
        component: ProductosAlmaceneroComponent
      },
      
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio-almacenero'
      }
    ]
  }
];