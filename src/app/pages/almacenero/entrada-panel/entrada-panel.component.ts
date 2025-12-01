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
import { ProductoService } from '../../../services/producto.service';
import { EntradaService } from '../../../services/entrada.service';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { AddEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/add-entrada-success/add-entrada-success.component';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
import { ClienteNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/cliente-null/cliente-null.component';
import { ProveedorNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/proveedor-null/proveedor-null.component';
import { TipoEntradaNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/tipo-entrada-null/tipo-entrada-null.component';

@Component({
  selector: 'app-entrada-panel',
  imports: [
    MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule,
    MatDialogModule, FormsModule, ReactiveFormsModule,
    MatOptionModule, MatInputModule, MatPaginatorModule
  ],
  templateUrl: './entrada-panel.component.html',
  styleUrl: './entrada-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntradaPanelComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);

  formProveedor!: FormGroup;
  proveedores: any[] = [];
  tipoentrada = new FormControl('', Validators.required);
  cliente = new FormControl('');
  clientes: any[] = [];
  entradasRegistradas: any[] = [];
  paginadasEntradas: any[] = [];

  pageSize: number = 5;
  pageIndex: number = 0;

  productos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private entradaService: EntradaService,
    private route: Router
  ) {
    this.formProveedor = this.fb.group({
      proveedor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarClientes();
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
    this.paginadasEntradas = this.entradasRegistradas.slice(start, end);
    this.cd.markForCheck();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => this.proveedores = proveedores,
      error: (err) => console.error('Error al cargar proveedores', err)
    });
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }


  get proveedor() {
    return this.formProveedor.get('proveedor') as FormControl;
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddEntradaComponent, {
      width: '550px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { productId, productName, quantity, price, category } = result;
        const total = quantity * price;

        this.entradasRegistradas.push({ productId, productName, quantity, price, total, category });

        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.cd.markForCheck();
      }
    });
  }

  eliminarEntrada(index: number) {
    const realIndex = (this.pageIndex * this.pageSize) + index;
    this.entradasRegistradas.splice(realIndex, 1);
    this.aplicarPaginacion();
  }

  realizarEntrada() {
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

  const productos = this.entradasRegistradas.map(p => ({
    productId: p.productId,
    quantity: p.quantity,
    price: p.price
  }));

  const payload = {
    tipoentrada: 'Proveedor',     
    supplierId: this.proveedor.value,
    productos
  };

  this.entradaService.crearEntrada(payload).subscribe({
    next: res => {
      this.dialog.open(AddEntradaSuccessComponent, { data: res });
      this.entradasRegistradas = [];
      this.aplicarPaginacion();
      this.route.navigate(['/almacenero/entrada-almacenero']);
    },
    error: err => console.error('Error al crear entrada', err)
  });
}

  gestor() {
    this.route.navigate(['/almacenero/entrada-almacenero']);
  }

  getMontoTotal(): number {
    return this.entradasRegistradas.reduce((sum, item) => sum + item.total, 0);
  }

  getCantidadTotal(): number {
    return this.entradasRegistradas.reduce((sum, item) => sum + item.quantity, 0);
  }
}
