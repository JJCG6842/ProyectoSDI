import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { GuiaRemisionService } from '../../../services/guia_remision.service';
import { ProductoService } from '../../../services/producto.service';
import { EntradaService } from '../../../services/entrada.service';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { AddEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/add-entrada-success/add-entrada-success.component';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
import { ProveedorNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/proveedor-null/proveedor-null.component';
import { shareReplay } from 'rxjs';

@Component({
  selector: 'app-guia-panel',
  imports: [
    MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule,
    MatDialogModule, FormsModule, ReactiveFormsModule,
    MatOptionModule, MatInputModule, MatPaginatorModule
  ],
  templateUrl: './guia-panel.component.html',
  styleUrl: './guia-panel.component.scss'
})
export class GuiaPanelComponent {
proveedores: any[] = [];
entradasRegistradas: any[] = [];
paginadasEntradas: any[] = [];
pageSize = 5;
pageIndex = 0;
formProveedor!: FormGroup;

constructor(
  private fb: FormBuilder,
  private proveedorService: ProveedorService,
  private guiaService: GuiaRemisionService,
  private route: Router,
  private dialog: MatDialog,
  private cd: ChangeDetectorRef
) {

  this.formProveedor = this.fb.group({
    proveedor: ['', Validators.required]
  });

}

ngOnInit(): void {
  this.cargarProveedores();
}

cargarProveedores() {
  this.proveedorService.getProveedores().subscribe({
    next: (res) => {
      this.proveedores = res;
      this.cd.markForCheck();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

addProduct() {
  const dialogRef = this.dialog.open(AddEntradaComponent, {
    width: '550px',
    maxWidth: 'none',
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
      this.entradasRegistradas.push(result);
      this.aplicarPaginacion();
      this.cd.markForCheck();
    }
  });
}

get proveedor() {
  return this.formProveedor.get('proveedor') as FormControl;
}

aplicarPaginacion() {
  const start =
    this.pageIndex * this.pageSize;
  const end =
    start + this.pageSize;
  this.paginadasEntradas =
    this.entradasRegistradas.slice(start, end);
}

eliminarEntrada(index: number) {
  const realIndex =
    (this.pageIndex * this.pageSize) + index;
  this.entradasRegistradas.splice(realIndex, 1);
  this.aplicarPaginacion();
}

getCantidadTotal(): number {
  return this.entradasRegistradas.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

generarNumeroGuia(): string {
  const fecha = Date.now();
  return `GR-${fecha}`;
}

realizarGuia() {

  if (this.entradasRegistradas.length === 0) {

    this.dialog.open(ProductNullComponent, {
      width: '400px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    return;
  }

  if (!this.proveedor.value) {

    this.dialog.open(ProveedorNullComponent, {
      width: '400px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    return;
  }

  const payload = {
    numero: this.generarNumeroGuia(),
    supplierId: this.proveedor.value,

    productos: this.entradasRegistradas.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
      serialNumbers: p.serialNumbers
    }))

  };

  this.guiaService.crearGuia(payload).subscribe({

    next: (res) => {

      this.dialog.open(
        AddEntradaSuccessComponent,
        {
          width: '400px',
          disableClose: true,
          data: {
            message: 'Guía creada correctamente'
          }
        }
      );

      this.entradasRegistradas = [];

      this.aplicarPaginacion();

      this.route.navigate([
        '/almacenero/guia-remision-almacenero'
      ]);

    },

    error: (err) => {
      console.error(
        'Error al crear guía',
        err
      );
    }
  });
}

gestor(){
  this.route.navigate(['/almacenero/guia-remision-almacenero'])
}

}
