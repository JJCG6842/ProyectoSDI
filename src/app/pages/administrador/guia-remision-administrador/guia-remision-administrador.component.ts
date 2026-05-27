import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
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
import { ViewGuiaAdministradorComponent } from '../../../shared/modals-administrador/view-guia-administrador/view-guia-administrador.component';

@Component({
  selector: 'app-guia-remision-administrador',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatPaginatorModule],
  templateUrl: './guia-remision-administrador.component.html',
  styleUrl: './guia-remision-administrador.component.scss'
})
export class GuiaRemisionAdministradorComponent {

  guias: any[] = [];
    guiasFiltradas: any[] = [];
    readonly dialog = inject(MatDialog)
    readonly reload = inject(ChangeDetectorRef);
    proveedores: Proveedor[] = [];
    selectedProveedorId: string = '';
    selectedEstado: string = '';
  
    constructor(private router: Router, private productoService: ProductoService, private entradaService: EntradaService,
      private proveedorService: ProveedorService, private clienteService: ClienteService, 
    private guiaService: GuiaRemisionService) { }
  
    ngOnInit(): void {
    this.cargarGuias();
    this.cargarProveedores();
  }
  
  cargarGuias() {
    this.guiaService.getGuias().subscribe({
      next: (res) => {
        this.guias = res;
        this.guiasFiltradas = [...res];
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
  
    this.reload.markForCheck();
  }
  
  getCantidadTotal(guia: any): number {
    return guia.detalles?.reduce(
      (acc: number, d: any) =>
        acc + d.cantidad,0
    ) ?? 0;
  }
  
  viewGuia(id: string) {
    this.router.navigate([
      '/administrador/view-guia-administrador',
      id
    ]);
  }
  
kardex() {
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

}
