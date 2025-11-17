import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interface/usuario.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { SalidaService } from '../../../services/salida.service';
import { Salida } from '../../../interface/salida.interface';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { Entrada } from '../../../interface/entrada.interface';
import { EntradaService } from '../../../services/entrada.service';

@Component({
  selector: 'app-inicio-almacenero',
  imports: [MatCardModule,MatIconModule],
  templateUrl: './inicio-almacenero.component.html',
  styleUrl: './inicio-almacenero.component.scss'
})
export class InicioAlmaceneroComponent implements OnInit{

  usuarioNombre: string = '';
  totalProductos: number = 0;
  totalEntradas: number = 0;
  totalProveedores: number = 0;
  totalSalidas: number = 0;
  totalMontoSalidas: number = 0;
  totalMontoEntradas: number = 0;

  constructor(private usuarioService: UsuarioService,private productoService: ProductoService,
    private entradaService: EntradaService,private proveedorService: ProveedorService, private salidasService: SalidaService){}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.usuarioNombre = userData.nombre;
      } else {
        this.usuarioNombre = 'Almacenero'; 
      }

      this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.totalProductos = productos.length;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });

    // this.entradaService.getEntradas().subscribe({
    //   next: (entradas: Entrada[]) => {
    //     this.totalEntradas = entradas.length;

    //     this.totalMontoEntradas = entradas.reduce((total, entrada) => {
    //     const precio = entrada.product?.price ?? 0;
    //     return total + precio * entrada.quantity;
    //   }, 0);
    //   }
    // })

    this.proveedorService.getProveedores().subscribe({
      next: (proveedor: Proveedor[]) => {
        this.totalProveedores = proveedor.length;
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    })

    // this.salidasService.getSalidas().subscribe({
    //   next: (salida: Salida[]) => {
    //     this.totalSalidas = salida.length;

    //     this.totalMontoSalidas = salida.reduce((total, salida) => {
    //     const precio = salida.product?.price ?? 0;
    //     return total + precio * salida.quantity;
    //   }, 0);
    //   },

    //   error: (err) => console.error('Error al cargar proveedores:', err)
    // });

  }

}
