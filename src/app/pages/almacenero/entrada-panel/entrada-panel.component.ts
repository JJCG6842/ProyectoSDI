import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../interface/producto.interface';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { AddEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/add-entrada-success/add-entrada-success.component';
import { EntradaService } from '../../../services/entrada.service';

@Component({
  selector: 'app-entrada-panel',
  imports: [MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule, MatDialogModule, FormsModule,
    ReactiveFormsModule, MatOptionModule, MatInputModule
  ],
  templateUrl: './entrada-panel.component.html',
  styleUrl: './entrada-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntradaPanelComponent {

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);

  formProveedor!: FormGroup;
  proveedores: any[] = [];
  entradasRegistradas: any[] = [];
  productos: any[] = [];
  totalCantidad: number = 0;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
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
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => this.proveedores = proveedores,
      error: (err) => console.error('Error al cargar proveedores', err)
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
        this.cd.markForCheck();
      }
    });
  }

  get totalCantidadEntradas() {
    return this.entradasRegistradas.reduce((acc, item) => acc + item.quantity, 0);
  }

  eliminarEntrada(index: number) {
    this.entradasRegistradas.splice(index, 1);
    this.cd.markForCheck();
  }

  realizarEntrada() {
    if (this.entradasRegistradas.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    if (!this.proveedor.value) {
      alert('Seleccione un proveedor');
      return;
    }

    const productos = this.entradasRegistradas.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
      price: p.price,
    }));

    const payload = {
      supplierId: this.proveedor.value,
      productos
    };

    this.entradaService.crearEntrada(payload).subscribe({
      next: (res) => {
        this.dialog.open(AddEntradaSuccessComponent, { data: res });
        this.entradasRegistradas = [];

        this.route.navigate(['/almacenero/entrada-almacenero']);
      },
      error: (err) => console.error('Error al crear entrada', err)
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
