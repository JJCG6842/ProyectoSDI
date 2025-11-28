import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSalidaComponent } from '../../../shared/modals-almacenero/add-salida/add-salida.component';
import { ProveedorService } from '../../../services/proveedor.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { SalidaService } from '../../../services/salida.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { Cliente } from '../../../interface/cliente.interface';
import { AddSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/add-salida-success/add-salida-success.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TipoSalida } from '../../../environments/tipos-salida.type';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
import { ClienteNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/cliente-null/cliente-null.component';
import { ProveedorNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/proveedor-null/proveedor-null.component';
import { TipoSalidaNullComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/tipo-salida-null/tipo-salida-null.component';

@Component({
  selector: 'app-salida-panel',
  imports: [
    MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule,
    MatDialogModule, FormsModule, ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './salida-panel.component.html',
  styleUrl: './salida-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalidaPanelComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);

  formProveedor!: FormGroup;

  proveedores: Proveedor[] = [];
  clientes: Cliente[] = [];
  salidas: any[] = [];

  tiposalida: TipoSalida = '';

  pageSize = 5;
  pageIndex = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private salidaService: SalidaService
  ) {

    this.formProveedor = this.fb.group({
      tiposalida: ['', Validators.required],
      supplier: [''],
      cliente: ['']
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  get pagedSalidas() {
    const start = this.pageIndex * this.pageSize;
    return this.salidas.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cd.markForCheck();
  }

  onTipoSalidaChange(tipo: string) {
    this.tiposalida = tipo as TipoSalida;

    this.formProveedor.patchValue({ supplier: '', cliente: '' });

    if (tipo === 'Venta') {
      this.cargarClientes();
      this.formProveedor.get('cliente')?.setValidators([Validators.required]);
      this.formProveedor.get('supplier')?.clearValidators();

    } else if (tipo === 'Devolucion') {
      this.cargarProveedores();
      this.formProveedor.get('supplier')?.setValidators([Validators.required]);
      this.formProveedor.get('cliente')?.clearValidators();

    } else {
      this.formProveedor.get('cliente')?.clearValidators();
      this.formProveedor.get('supplier')?.clearValidators();
    }

    this.formProveedor.get('cliente')?.updateValueAndValidity();
    this.formProveedor.get('supplier')?.updateValueAndValidity();

    this.cd.markForCheck();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: res => {
        this.proveedores = res;
        this.cd.markForCheck();
      }
    });
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: res => {
        this.clientes = res;
        this.cd.markForCheck();
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddSalidaComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salidas.push(result);
        this.pageIndex = 0;
        this.cd.markForCheck();
      }
    });
  }

  get totalCantidad() {
    return this.salidas.reduce((acc, item) => acc + item.quantity, 0);
  }

  get totalMonto() {
    return this.salidas.reduce((acc, item) => acc + item.total, 0);
  }

  deleteSalida(index: number) {
    this.salidas.splice(index, 1);
    this.pageIndex = 0;
    this.cd.markForCheck();
  }

  async realizarSalida() {

    if (!this.tiposalida) {
      const dialogRef = this.dialog.open(TipoSalidaNullComponent, {
        width: '400px',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
      return;
    }

    if (this.salidas.length === 0) {
      const dialogRef = this.dialog.open(ProductNullComponent, {
        width: '400px',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
      return;
    }

    for (const salida of this.salidas) {
      const producto = await this.productoService.getProductoporId(salida.productId).toPromise();

      if (!producto) {
        alert(`Producto ${salida.productName} no encontrado`);
        return;
      }

      if (salida.quantity > producto.quantity) {
        alert(`Cantidad solicitada de ${salida.productName} supera el stock`);
        return;
      }
    }

    const productos = this.salidas.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
      price: p.price
    }));

    const data = {

      tipo:
        this.tiposalida === 'Venta'
          ? 'cliente'
          : this.tiposalida === 'Devolucion'
            ? 'proveedor'
            : 'interno',

      tiposalida: this.tiposalida,

      supplierId:
        this.tiposalida === 'Devolucion'
          ? this.formProveedor.value.supplier
          : null,

      clienteId:
        this.tiposalida === 'Venta'
          ? this.formProveedor.value.cliente
          : null,

      productos
    };

    console.log("DATA ENVIADA:", data);

    this.salidaService.createSalida(data).subscribe({
      next: () => {
        this.dialog.open(AddSalidaSuccessComponent);
        this.salidas = [];
        this.router.navigate(['/almacenero/salida-almacenero']);
      },
      error: err => console.error(err)
    });
  }

  gestor() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }
}
