import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SalidaService } from '../../../services/salida.service';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../../interface/proveedor.interface';
import { Cliente } from '../../../interface/cliente.interface';
import { Salida } from '../../../interface/salida.interface';
import { AddSalidaComponent } from '../../../shared/modals-almacenero/add-salida/add-salida.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteSalidaConfirmComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/delete-salida-confirm/delete-salida-confirm.component';
import { Producto } from '../../../interface/producto.interface';
import { DeleteSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/delete-salida-success/delete-salida-success.component';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProveedorService } from '../../../services/proveedor.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-salidas-administrador',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatTimepickerModule, MatInputModule, MatPaginatorModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-administrador.component.html',
  styleUrl: './salidas-administrador.component.scss'
})
export class SalidasAdministradorComponent implements OnInit {

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  pageSize = 5;
  pageIndex = 0;
  clientes: Cliente[] = [];
  opciones: string[] = ['Cliente', 'Proveedor'];
  proveedores: Proveedor[] = [];
  salidas: Salida[] = [];
  selectedClienteId: string = '';
  selectedProveedorId: string = '';
  salidasFiltradas: any[] = [];
  selectedOpcion: string = '';


  constructor(private router: Router, private productoService: ProductoService,
    private salidaService: SalidaService, private proveedorService: ProveedorService, private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.cargarSalidas();
    this.cargarProductos();
    this.cargarClientes();
    this.cargarProveedores();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (res) => {
        this.clientes = res;
        this.reload.markForCheck();
      },
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  cargarProveedores() {
    this, this.proveedorService.getProveedores().subscribe({
      next: (res) => {
        this.proveedores = res;
        this.reload.markForCheck();
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  get pagedSalidas(): Salida[] {
    const start = this.pageIndex * this.pageSize;
    return this.salidasFiltradas.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.reload.markForCheck();
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

  cargarSalidas() {
    this.salidaService.getSalidas().subscribe({
      next: (data) => {
        this.salidas = data;
        this.salidasFiltradas = [...data];
        this.isloading = false;
        this.pageIndex = 0;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar salidas:', err);
        this.isloading = false;
      },
    })
  }

  search() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.cargarSalidas();
      return;
    }

    this.isloading = true;

    this.salidaService.buscarPorProducto(term).subscribe({
      next: (res) => {
        this.salidas = res;
        this.isloading = false;
        this.pageIndex = 0;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al buscar salidas:', err);
        this.salidas = [];
        this.isloading = false;
        this.pageIndex = 0;
        this.reload.markForCheck();
      },
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();
    if (!this.searchTerm) {
      this.cargarSalidas();
    }
  }

  getCantidadTotal(salida: Salida): number {
    return salida.detalles?.reduce((acc, d) => acc + d.quantity, 0) ?? 0;
  }

  getMontoTotal(salida: Salida): number {
    return salida.detalles?.reduce((acc, d) => acc + d.total, 0) ?? 0;
  }

  getNombreProveedorCliente(salida: Salida): string {
    if (salida.tipo === 'proveedor') {
      return salida.supplier?.name || 'Sin proveedor';
    }
    if (salida.tipo === 'cliente') {
      return salida.cliente?.name || 'Sin cliente';
    }
    return '—';
  }


  filtrarSalidas() {
    if (this.selectedOpcion === 'Cliente') {
      if (!this.selectedClienteId) {
        this.salidasFiltradas = [...this.salidas];
        return;
      }
      this.salidasFiltradas = this.salidas.filter(
        s => s.clienteId === this.selectedClienteId
      );
    }

    if (this.selectedOpcion === 'Proveedor') {
      if (!this.selectedProveedorId) {
        this.salidasFiltradas = [...this.salidas];
        return;
      }
      this.salidasFiltradas = this.salidas.filter(
        s => s.supplierId === this.selectedProveedorId
      );
    }

    this.pageIndex = 0;
    this.reload.markForCheck()
  }

  onOpcionChange() {
    this.selectedClienteId = '';
    this.selectedProveedorId = '';
this.pageIndex = 0;
    this.salidasFiltradas = [...this.salidas];
  }


  view(id: string) {
    this.router.navigate(['administrador/view-salida-administrador', id]);
  }


  kardex() {
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

}
