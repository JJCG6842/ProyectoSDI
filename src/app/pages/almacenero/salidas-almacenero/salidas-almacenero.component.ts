import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SalidaService } from '../../../services/salida.service';
import { FormsModule } from '@angular/forms';
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
import { Usuario } from '../../../interface/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-salidas-almacenero',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatTimepickerModule, MatInputModule, MatPaginatorModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-almacenero.component.html',
  styleUrl: './salidas-almacenero.component.scss'
})
export class SalidasAlmaceneroComponent implements OnInit {

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  pageSize = 5;
  pageIndex = 0;
  salidas: Salida[] = [];
  destinoId: string = '';
  destinos: Usuario[] = [];
  salidasFiltradas: any[] = [];
  selectedOpcion: string = '';
  selectedUserId: string = '';
  currentUserId: string = '';
  usuarios: Usuario[] = [];

  constructor(private router: Router, private productoService: ProductoService,
    private salidaService: SalidaService, private proveedorService: ProveedorService, private clienteService: ClienteService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarSalidas();
    this.cargarProductos();
    this.cargarUsuarios();
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

  cargarUsuarios() {
    this.usuarioService.getUsuario().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.reload.markForCheck();
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  filtrarPorUsuario() {
    if (!this.selectedUserId) {
      this.salidasFiltradas = [...this.salidas];
    } else {
      this.salidasFiltradas = this.salidas.filter(
        salida => salida.userId === this.selectedUserId
      );
    }
    this.pageIndex = 0;
    this.reload.markForCheck();
  }

  addSalidas() {
    const dialogRef = this.dialog.open(AddSalidaComponent, {
      width: '550px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.cargarSalidas();
      }
    });
  }

  eraseSalida(id: string): void {
    const dialogRef = this.dialog.open(DeleteSalidaConfirmComponent, {
      width: '400px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.isloading = true;
        this.salidaService.deleteSalida(id).subscribe({
          next: () => {
            this.dialog.open(DeleteSalidaSuccessComponent, {
              width: '400px',
              disableClose: true,
            });
            this.cargarSalidas();
          },
          error: (error) => {
            console.error('Error al eliminar entrada:', error);
            this.isloading = false;
          },
        });
      }
    });
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

  filtrarPorDestino() {
  if (!this.destinoId) {
    this.salidasFiltradas = [...this.salidas];
    this.pageIndex = 0;
    this.reload.markForCheck();
    return;
  }

  this.salidaService.getSalidasByDestino(this.destinoId)
    .subscribe({
      next: (salidas) => {
        this.salidasFiltradas = salidas;
        this.pageIndex = 0;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error filtrando por destino:', err);
        this.salidasFiltradas = [];
        this.pageIndex = 0;
        this.reload.markForCheck();
      },
    });
}

  view(id: string) {
    this.router.navigate(['almacenero/view-salida-almacenero', id]);
  }

  kardex() {
    this.router.navigate(['/almacenero/panel-inventario'])
  }

  entradas() {
    this.router.navigate(['/almacenero/salida-panel-almacenero'])
  }
}
