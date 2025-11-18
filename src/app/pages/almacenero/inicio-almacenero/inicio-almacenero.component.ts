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

  // Productos
  this.productoService.getProductos().subscribe({
    next: (productos: Producto[]) => {
      this.totalProductos = productos.length;
    },
    error: (err) => console.error('Error al cargar productos:', err)
  });

  // Entradas
  this.entradaService.getEntradas().subscribe({
    next: (entradas: Entrada[]) => {
      this.totalEntradas = entradas.length;

      this.totalMontoEntradas = entradas.reduce((totalEntrada, entrada) => {
        // Sumar todos los detalles de cada entrada
        const subtotalEntrada = entrada.detalles?.reduce((sum, detalle) => {
          return sum + (detalle.quantity * (detalle.product?.price ?? 0));
        }, 0) ?? 0;

        return totalEntrada + subtotalEntrada;
      }, 0);
    },
    error: (err) => console.error('Error al cargar entradas:', err)
  });

  // Proveedores
  this.proveedorService.getProveedores().subscribe({
    next: (proveedores: Proveedor[]) => {
      this.totalProveedores = proveedores.length;
    },
    error: (err) => console.error('Error al cargar proveedores:', err)
  });

  // Salidas
  this.salidasService.getSalidas().subscribe({
    next: (salidas: Salida[]) => {
      this.totalSalidas = salidas.length;

      this.totalMontoSalidas = salidas.reduce((totalSalida, salida) => {
        const subtotalSalida = salida.detalles?.reduce((sum, detalle) => {
          return sum + (detalle.quantity * (detalle.product?.price ?? 0));
        }, 0) ?? 0;

        return totalSalida + subtotalSalida;
      }, 0);
    },
    error: (err) => console.error('Error al cargar salidas:', err)
  });
}

}
