import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../interface/producto.interface';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Entrada } from '../../../interface/entrada.interface';
import { Salida } from '../../../interface/salida.interface';

@Component({
  selector: 'app-kardex-almacenero',
  imports: [MatExpansionModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule, FormsModule, MatDatepickerModule,
    MatNativeDateModule, MatPaginatorModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kardex-almacenero.component.html',
  styleUrl: './kardex-almacenero.component.scss'
})
export class KardexAlmaceneroComponent {

  readonly reload = inject(ChangeDetectorRef);
  movimientos: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  filtroProducto = '';
  tipoFiltro: 'todos' | 'entrada' | 'salida' = 'todos';
  filtroTiempo: 'todo' | 'mes' | '6meses' | 'anio' = 'todo';
  fechaFiltroRango: Date | null = null;
  ordenFecha: 'asc' | 'desc' = 'desc';
  fechaFiltro: Date | null = null;
  movimientosPaginados: any[] = [];
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

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPaginacion();
    this.reload.markForCheck();
  }

  actualizarPaginacion() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.movimientosPaginados = this.movimientosFiltrados.slice(start, end);
  }

  get movimientosFiltrados() {
    let lista = this.movimientos
      .filter(mov => {
        const coincideProducto = mov.producto
          .toLowerCase()
          .includes(this.filtroProducto.toLowerCase());
        const coincideTipo =
          this.tipoFiltro === 'todos' ||
          (this.tipoFiltro === 'entrada' && mov.movimiento === 'Entrada') ||
          (this.tipoFiltro === 'salida' && mov.movimiento === 'Salida');

        const coincideRango =
          !this.fechaFiltroRango ||
          new Date(mov.fecha) >= this.fechaFiltroRango;

        const coincideFecha =
          !this.fechaFiltro ||
          new Date(mov.fecha).toDateString() === this.fechaFiltro.toDateString();
        return coincideProducto && coincideTipo && coincideFecha && coincideRango;
      })
      .sort((a, b) =>
        this.ordenFecha === 'desc'
          ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

    this.movimientosPaginados = lista.slice(
      this.pageIndex * this.pageSize,
      this.pageIndex * this.pageSize + this.pageSize
    );

    return lista;
  }

  ordenarMovimientos() {
    this.movimientos.sort((a, b) =>
      this.ordenFecha === 'desc'
        ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }

  filtrarPorTiempo() {
    const hoy = new Date();

    let fechaInicio: Date | null = null;

    switch (this.filtroTiempo) {
      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;

      case '6meses':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 6, hoy.getDate());
        break;

      case 'anio':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        break;

      case 'todo':
        fechaInicio = null;
        break;
    }

    this.fechaFiltroRango = fechaInicio;
    this.pageIndex = 0;
    this.actualizarPaginacion();
    this.reload.markForCheck();
  }


  search() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filtroProducto = '';
      this.pageIndex = 0;
      this.actualizarPaginacion();
      this.reload.markForCheck();
      return;
    }

    this.filtroProducto = term;
    this.pageIndex = 0;
    this.actualizarPaginacion();
    this.reload.markForCheck();
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();

    if (!this.searchTerm) {
      this.limpiarFiltros();
    }
  }

  limpiarFiltros() {
    this.filtroProducto = '';
    this.tipoFiltro = 'todos';
    this.ordenFecha = 'desc';
    this.fechaFiltro = null;

    this.pageIndex = 0;
    this.actualizarPaginacion();
    this.reload.markForCheck();
  }
}
