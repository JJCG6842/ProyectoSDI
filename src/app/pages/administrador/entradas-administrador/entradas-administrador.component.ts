import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntradaService } from '../../../services/entrada.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Entrada } from '../../../interface/entrada.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interface/proveedor.interface';

@Component({
  selector: 'app-entradas-administrador',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entradas-administrador.component.html',
  styleUrl: './entradas-administrador.component.scss'
})
export class EntradasAdministradorComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  entradas: Entrada[] = [];
  proveedores: Proveedor[] = [];
  entradasFiltradas: Entrada[] = [];
  selectedProveedorId: string = '';
  pageSize = 5;
  pageIndex = 0;

  constructor(private router: Router, private productoService: ProductoService, private entradaService: EntradaService,
    private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.cargarEntradas();
    this.cargarProductos();
    this.cargarProveedores();
  }

  get pagedEntradas(): Entrada[] {
    if (!this.paginator) return this.entradasFiltradas;

    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.entradasFiltradas.slice(start, start + this.paginator.pageSize);
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        this.isloading = false;
        console.error('Error al cargar productos', err);
      }
    })
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (res) => {
        this.proveedores = res;
        this.reload.markForCheck();
      },
      error: (err) => console.error('Error al cargar proveedores', err)
    });
  }

  cargarEntradas() {
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.entradas = data.map(e => ({ ...e }));
        this.entradasFiltradas = [...this.entradas];

        if (this.paginator) this.paginator.firstPage();

        this.reload.markForCheck();
      },
      error: err => console.error('Error al cargar entradas', err)
    });
  }

  search() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.cargarEntradas();
      return;
    }

    this.isloading = true;

    this.entradaService.buscarPorProducto(term).subscribe({
      next: (res) => {

        this.entradas = res;
        this.entradasFiltradas = [...res];

        if (this.paginator) this.paginator.firstPage();

        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al buscar entradas:', err);

        this.entradas = [];
        this.entradasFiltradas = [];

        if (this.paginator) this.paginator.firstPage();

        this.isloading = false;
        this.reload.markForCheck();
      },
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();
    if (!this.searchTerm) {
      this.cargarEntradas();
    }
  }

  filtrarPorProveedor() {
    if (!this.selectedProveedorId) {
      this.entradasFiltradas = [...this.entradas];
    } else {
      this.entradasFiltradas = this.entradas.filter(
        e => e.supplierId === this.selectedProveedorId
      );
    }

    if (this.paginator) this.paginator.firstPage();

    this.reload.markForCheck();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.reload.markForCheck();
  }

  getCantidadTotal(entrada: Entrada): number {
    return entrada.detalles?.reduce((acc, p) => acc + p.quantity, 0) ?? 0;
  }

  getMontoTotal(entrada: Entrada): number {
    return entrada.detalles?.reduce((acc, p) => acc + p.quantity * p.price, 0) ?? 0;
  }

  getNombreProveedor(entrada: Entrada): string {
    return entrada.supplier?.name || 'Sin proveedor';
  }

  view(id: string) {
    this.router.navigate(['administrador/view-entrada-administrador', id]);
  }


  kardex() {
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

  salidas() {
    this.router.navigate(['/administrador/entrada-panel-administrador'])
  }
}
