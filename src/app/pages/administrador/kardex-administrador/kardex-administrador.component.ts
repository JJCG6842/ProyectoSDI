import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../services/entrada.service';
import { SalidaService } from '../../../services/salida.service';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../interface/producto.interface';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Entrada } from '../../../interface/entrada.interface';
import { Salida } from '../../../interface/salida.interface';

@Component({
  selector: 'app-kardex-administrador',
  imports: [MatExpansionModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule, FormsModule, MatDatepickerModule,
    MatNativeDateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kardex-administrador.component.html',
  styleUrl: './kardex-administrador.component.scss'
})
export class KardexAdministradorComponent {

  readonly reload = inject(ChangeDetectorRef);
  movimientos: any[] = [];
  filtroProducto = '';
  tipoFiltro: 'todos' | 'entrada' | 'salida' = 'todos';
  ordenFecha: 'asc' | 'desc' = 'desc';
  fechaFiltro: Date | null = null;
  isLoading = true;
  productos: Producto[] = [];
  searchTerm: string = '';

  constructor(
    private entradaService: EntradaService, private salidaService: SalidaService,
    private productoService: ProductoService, private router: Router) { }

  async ngOnInit() {
    await this.cargarMovimientos();
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        this.isLoading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cargar productos', err);
      }
    })
  }

  async cargarMovimientos() {
  this.isLoading = true;
  try {
    const [entradas, salidas] = await Promise.all([
      firstValueFrom(this.entradaService.getEntradas()),
      firstValueFrom(this.salidaService.getSalidas())
    ]);

    const entradasFormateadas = (entradas ?? []).flatMap(e =>
      (e.detalles ?? []).map(d => ({
        fecha: e.createdAt,
        movimiento: 'Entrada',
        proveedor: e.supplier?.name ?? '—',
        producto: d.product?.name ?? '—',
        cantidad: d.quantity,
        precio: d.price ?? d.product?.price ?? 0,
        total: d.total ?? d.quantity * (d.price ?? d.product?.price ?? 0)
      }))
    );

    const salidasFormateadas = (salidas ?? []).flatMap(s =>
      (s.detalles ?? []).map(d => ({
        fecha: s.createdAt,
        movimiento: 'Salida',
        proveedor: s.supplier?.name || s.cliente?.name || '—',
        producto: d.product?.name ?? '—',
        cantidad: d.quantity,
        precio: d.price ?? d.product?.price ?? 0,
        total: d.total ?? d.quantity * (d.price ?? d.product?.price ?? 0)
      }))
    );

    this.movimientos = [...entradasFormateadas, ...salidasFormateadas];
    this.ordenarMovimientos();

  } catch (error) {
    console.error('Error al cargar movimientos:', error);
  } finally {
    this.isLoading = false;
    this.reload.markForCheck();
  }
}

  get movimientosFiltrados() {
    return this.movimientos
      .filter(mov => {
        const coincideProducto = mov.producto
          .toLowerCase()
          .includes(this.filtroProducto.toLowerCase());
        const coincideTipo =
          this.tipoFiltro === 'todos' ||
          (this.tipoFiltro === 'entrada' && mov.movimiento === 'Entrada') ||
          (this.tipoFiltro === 'salida' && mov.movimiento === 'Salida');

        const coincideFecha =
          !this.fechaFiltro ||
          new Date(mov.fecha).toDateString() === this.fechaFiltro.toDateString();
        return coincideProducto && coincideTipo && coincideFecha;
      })
      .sort((a, b) =>
        this.ordenFecha === 'desc'
          ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  }

  ordenarMovimientos() {
    this.movimientos.sort((a, b) =>
      this.ordenFecha === 'desc'
        ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }

  search() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.cargarProductos();
      return;
    }

    this.isLoading = true;

    this.productoService.buscarProducto(term).subscribe({
      next: (res) => {
        this.productos = res;
        this.isLoading = false;
        this.reload.markForCheck();
      },

      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.productos = [];
        this.isLoading = false;
        this.reload.markForCheck();
      }
    })
  }

  limpiarFiltros() {
    this.filtroProducto = '';
    this.tipoFiltro = 'todos';
    this.ordenFecha = 'desc';
    this.fechaFiltro = null;
    this.reload.markForCheck();
  }

  entradas() {
    this.router.navigate(['/almacenero/entrada-almacenero']);
  }

  salidas() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }
}
