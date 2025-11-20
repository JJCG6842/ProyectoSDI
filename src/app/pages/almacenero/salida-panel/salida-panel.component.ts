import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit, viewChild } from '@angular/core';
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
import { Proveedor } from '../../../interface/proveedor.interface';
import { Cliente } from '../../../interface/cliente.interface';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../interface/producto.interface';
import { AddSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/add-salida-success/add-salida-success.component';
import { SalidaService } from '../../../services/salida.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-salida-panel',
  imports: [MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule, MatDialogModule, FormsModule,
    ReactiveFormsModule, MatOptionModule, MatInputModule, MatPaginatorModule
  ],
  templateUrl: './salida-panel.component.html',
  styleUrl: './salida-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalidaPanelComponent implements OnInit {

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);

  formProveedor!: FormGroup;
  proveedores: Proveedor[] = [];
  productosSeleccionados: any[] = [];
  cantidadTotal: number = 0;
  montoTotal: number = 0;
  clientes: Cliente[] = [];
  pageSize = 5;
  pageIndex = 0;
  salidas: any[] = [];
  isloading = false
  tipoDestino: 'proveedor' | 'cliente' | '' = '';


  constructor(private route: Router, private fb: FormBuilder, private proveedorService: ProveedorService
    , private clienteService: ClienteService, private cd: ChangeDetectorRef, private productoService: ProductoService,
    private salidaService: SalidaService) {
    this.formProveedor = this.fb.group({
      tipoDestino: ['', Validators.required],
      provider: [''],
      cliente: [''],
    })
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

  onTipoDestinoChange(tipo: string) {
    this.tipoDestino = tipo as 'proveedor' | 'cliente';

    this.formProveedor.patchValue({ provider: '', cliente: '' });

    if (tipo === 'proveedor') {
      this.cargarProveedores();
      this.formProveedor.get('provider')?.setValidators([Validators.required]);
      this.formProveedor.get('cliente')?.clearValidators();
    } else if (tipo === 'cliente') {
      this.cargarClientes();
      this.formProveedor.get('cliente')?.setValidators([Validators.required]);
      this.formProveedor.get('provider')?.clearValidators();
    }

    this.formProveedor.get('provider')?.updateValueAndValidity();
    this.formProveedor.get('cliente')?.updateValueAndValidity();

    this.cd.markForCheck();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedor) => {
        this.proveedores = proveedor;
      },
      error: (fail) => {
        console.error('error al cargar proveedores', fail)
      },
    })
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  get provider() {
    return this.formProveedor.get('provider') as FormControl;
  }
  get cliente() {
    return this.formProveedor.get('cliente') as FormControl;
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddSalidaComponent, {
      width: '550px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const producto = this.productosSeleccionados.find(p => p.id === result.productId);

      if (producto) {
        producto.quantity -= result.quantity;

        producto.status = producto.quantity > 0 ? 'Instock' : 'Outstock';
      }

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

  if (!this.tipoDestino) {
    alert("Seleccione proveedor o cliente");
    return;
  }

  if (this.salidas.length === 0) {
    alert("Debe agregar al menos un producto");
    return;
  }

  for (const salida of this.salidas) {
    try {
      const producto = await this.productoService.getProductoporId(salida.productId).toPromise();
      if (!producto) {
        alert(`Producto "${salida.productName}" no encontrado`);
        return;
      }

      if (salida.quantity > producto.quantity) {
        alert(`Cantidad solicitada para "${salida.productName}" (${salida.quantity}) supera el stock disponible (${producto.quantity})`);
        return;
      }

    } catch (err) {
      console.error(err);
      alert(`Error verificando stock del producto "${salida.productName}"`);
      return;
    }
  }

  const productos = this.salidas.map(p => ({
    productId: p.productId,
    quantity: p.quantity,
    price: p.price
  }));

  const data = {
    tipo: this.tipoDestino,
    supplierId: this.tipoDestino === 'proveedor' ? this.formProveedor.value.provider : null,
    clienteId: this.tipoDestino === 'cliente' ? this.formProveedor.value.cliente : null,
    productos
  };

  console.log('Payload salida:', data);


  this.salidaService.createSalida(data).subscribe({
    next: () => {
      this.dialog.open(AddSalidaSuccessComponent);
      this.salidas = [];
      this.route.navigate(['/almacenero/salida-almacenero']);
    },
    error: err => console.error('Error al crear salida:', err)
  });
}

  gestor() {
    this.route.navigate(['/almacenero/salida-almacenero'])
  }


}
