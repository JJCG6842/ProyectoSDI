import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntradaService } from '../../../services/entrada.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Entrada } from '../../../interface/entrada.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { EraseEntradaConfirmComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/erase-entrada-confirm/erase-entrada-confirm.component';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { DeleteEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/delete-entrada-success/delete-entrada-success.component';
import { MatFormField, MatSelect, MatOption } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../interface/cliente.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { GuiaRemision } from '../../../interface/guia_remision';
import { GuiaRemisionService } from '../../../services/guia_remision.service';
import { DeleteGuiaConfirmComponent } from '../../../shared/modals-almacenero/modals-guia/delete-guia-confirm/delete-guia-confirm.component';
import { DeleteGuiaSuccessComponent } from '../../../shared/modals-almacenero/modals-guia/delete-guia-success/delete-guia-success.component';
import { ViewGuiaComponent } from '../../../shared/modals-almacenero/modals-guia/view-guia/view-guia.component';
import { EditGuiaComponent } from '../../../shared/modals-almacenero/modals-guia/edit-guia/edit-guia.component';


@Component({
  selector: 'app-guia-remision-almacenero',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatPaginatorModule],
  templateUrl: './guia-remision-almacenero.component.html',
  styleUrl: './guia-remision-almacenero.component.scss'
})
export class GuiaRemisionAlmaceneroComponent implements OnInit, AfterViewInit {

  guias: any[] = [];
  guiasFiltradas: any[] = [];
  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  proveedores: Proveedor[] = [];
  selectedProveedorId: string = '';
  selectedEstado: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
    pageSize = 6;
    pageIndex = 0;
    guiasPaginadas: any[] = [];

  constructor(private router: Router, private productoService: ProductoService, private entradaService: EntradaService,
    private proveedorService: ProveedorService, private clienteService: ClienteService, 
  private guiaService: GuiaRemisionService) { }

  ngOnInit(): void {
  this.cargarGuias();
  this.cargarProveedores();
}

ngAfterViewInit(): void {
  this.paginator.page.subscribe(() => {
    this.pageIndex = this.paginator.pageIndex;
    this.pageSize = this.paginator.pageSize;
    this.aplicarPaginacion();

  });

}

aplicarPaginacion() {
  const inicio = this.pageIndex * this.pageSize;
  const fin = inicio + this.pageSize;
  this.guiasPaginadas =
    this.guiasFiltradas.slice(inicio, fin);
  this.reload.markForCheck();
}

cargarGuias() {
  this.guiaService.getGuias().subscribe({
    next: (res) => {
      this.guias = res;
      this.guiasFiltradas = [...res];
      this.pageIndex = 0;
      this.aplicarPaginacion();
      this.reload.markForCheck();
    },
    error: (err) => console.error('Error al cargar guias', err)
  });
}

cargarProveedores() {
  this.proveedorService.getProveedores().subscribe({
    next: (res) => {
      this.proveedores = res;
      this.reload.markForCheck();
    },

    error: (err) => {
      console.error(
        'Error al cargar proveedores',
        err
      );
    }
  });
}

aplicarFiltros() {

  this.guiasFiltradas = this.guias.filter(g => {
    const proveedorOk = !this.selectedProveedorId || g.supplierId === this.selectedProveedorId;
    const estadoOk = !this.selectedEstado || g.estado === this.selectedEstado;

    return proveedorOk && estadoOk;
  });

  this.pageIndex = 0;
  this.aplicarPaginacion();
}

getCantidadTotal(guia: any): number {
  return guia.detalles?.reduce(
    (acc: number, d: any) =>
      acc + d.cantidad,0
  ) ?? 0;
}

viewGuia(id: string) {
  this.router.navigate([
    '/almacenero/view-guia-almacenero',
    id
  ]);
}

editarEstado(guia: any) {
  const dialogRef = this.dialog.open(
    EditGuiaComponent,
    {
      width: '450px',
      disableClose: true,
      data: guia
    }
  );
  dialogRef.afterClosed().subscribe((updated) => {
    if (updated) {
      this.cargarGuias();
    }

  });

}

eliminarGuia(id: string): void {
  const dialogRef = this.dialog.open(
    DeleteGuiaConfirmComponent,
    {
      width: '400px',
      disableClose: true,
      data: { id }
    }
  );

  dialogRef.afterClosed().subscribe((confirmado) => {

    if (confirmado) {

      this.guiaService.eliminarGuia(id).subscribe({

        next: () => {

          this.dialog.open(
            DeleteGuiaSuccessComponent,
            {
              width: '400px',
              disableClose: true
            }
          );

          this.cargarGuias();
        },

        error: (err) => {
          console.error(
            'Error al eliminar guía',
            err
          );
        }

      });

    }

  });

}

  kardex() {
    this.router.navigate(['/almacenero/panel-inventario'])
  }

  addguia(){
    this.router.navigate(['/almacenero/guia-panel-almacenero'])
  }
}
