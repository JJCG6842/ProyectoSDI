import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AddSupplierComponent } from '../../../shared/modals-administrador/add-supplier/add-supplier.component';
import { EditSupplierComponent } from '../../../shared/modals-administrador/edit-supplier/edit-supplier.component';
import { DeleteSupplierConfirmComponent } from '../../../shared/modals-administrador/modals/delete-supplier-confirm/delete-supplier-confirm.component';
import { DeleteSupplierSuccessComponent } from '../../../shared/modals-administrador/modals/delete-supplier-success/delete-supplier-success.component';
import { Proveedor } from '../../../interface/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { ViewSupplierComponent } from '../../../shared/modals-administrador/view-supplier/view-supplier.component';
import { ViewProductInventarioComponent } from '../../../shared/view-product-inventario/view-product-inventario.component';


@Component({
  selector: 'app-proveedor-almacenero',
  imports: [
    MatIconModule, MatDialogModule, MatButtonModule, CommonModule,
    FormsModule, MatInputModule, MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-almacenero.component.html',
  styleUrl: './proveedor-almacenero.component.scss'
})
export class ProveedorAlmaceneroComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  
  proveedores: Proveedor[] = [];
  pageSize = 8;
  pageIndex = 0;
  paginatedProveedores: Proveedor[] = [];

  isLoading = false;
  searchTerm: string = '';

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerSuppliers();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.aplicarPaginacion();
      });
    }
  }

  aplicarPaginacion() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProveedores = this.proveedores.slice(start, end);
    this.cd.markForCheck();
  }

  obtenerSuppliers() {
    this.proveedorService.getProveedores().subscribe({
      next: (res) => {
        this.proveedores = res;
        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener proveedores:', err);
        this.isLoading = false;
      }
    });
  }

  search() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.obtenerSuppliers();
      return;
    }

    this.isLoading = true;

    this.proveedorService.buscarProveedor(term).subscribe({
      next: (res) => {
        this.proveedores = res;
        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda', err);
        this.proveedores = [];
        this.paginatedProveedores = [];
        this.isLoading = false;
      }
    });
  }

  createSupplier() {
    const dialogRef = this.dialog.open(AddSupplierComponent, {
      width: '70%',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.obtenerSuppliers();
    });
  }

  editSupplier(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(EditSupplierComponent, {
      width: '70%',
      panelClass: 'custom-dialog-container',
      data: proveedor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.obtenerSuppliers();
    });
  }

  deleteSupplier(id: string) {
    const dialogRef = this.dialog.open(DeleteSupplierConfirmComponent);

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.proveedorService.eliminarProveedor(id).subscribe({
          next: () => {
            this.dialog.open(DeleteSupplierSuccessComponent);
            this.obtenerSuppliers();
          },
          error: (err) => console.error('Error al eliminar proveedor', err)
        });
      }
    });
  }

  view(proveedores: Proveedor) {
      const dialogRef = this.dialog.open(ViewSupplierComponent, {
        width: '600px',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
        data: proveedores
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }
}
