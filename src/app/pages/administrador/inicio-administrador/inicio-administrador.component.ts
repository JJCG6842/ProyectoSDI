import { Component, OnInit ,ChangeDetectionStrategy} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interface/usuario.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { SalidaService } from '../../../services/salida.service';
import { Salida } from '../../../interface/salida.interface';
import { Entrada } from '../../../interface/entrada.interface';
import { EntradaService } from '../../../services/entrada.service';

@Component({
  selector: 'app-inicio-administrador',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './inicio-administrador.component.html',
  styleUrl: './inicio-administrador.component.scss'
})
export class InicioAdministradorComponent implements OnInit{
  usuarioLogueado: string = '';
  totalAlmaceneros: number = 0;
  totalProveedores: number = 0;
  totalProductos: number = 0;
  totalEntradas: number = 0;
  totalSalidas: number = 0;

  constructor(private usuarioService: UsuarioService, private proveedorService: ProveedorService, private productoService: ProductoService,
    private entradaService: EntradaService,private salidasService: SalidaService
  ){}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.usuarioLogueado = userData.nombre;
    } else {
      this.usuarioLogueado = 'Administrador';
    }

    this.usuarioService.getUsuario().subscribe({
      next: (usuarios: Usuario[]) => {
        this.totalAlmaceneros = usuarios.filter(u => u.role === 'Almacenero').length;
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });

    this.proveedorService.getProveedores().subscribe({
      next: (proveedor: Proveedor[]) => {
        this.totalProveedores = proveedor.length;
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    })

    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.totalProductos = productos.length;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    })

    this.entradaService.getEntradas().subscribe({
      next: (entradas: Entrada[]) => {
        this.totalEntradas = entradas.length;
      },
      error: (err) => console.error('Error al cargar entradas:', err)
    })

    this.salidasService.getSalidas().subscribe({
      next: (salida: Salida[]) => {
        this.totalSalidas = salida.length;
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    })
  }
    


}
