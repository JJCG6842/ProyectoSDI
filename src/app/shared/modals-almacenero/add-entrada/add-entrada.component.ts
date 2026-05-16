import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { EntradaService } from '../../../services/entrada.service';
import { Producto } from '../../../interface/producto.interface';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { Proveedor } from '../../../interface/proveedor.interface';
import { AddEntradaSuccessComponent } from './modals-entrada/add-entrada-success/add-entrada-success.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-entrada',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule,MatChipsModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-entrada.component.html',
  styleUrl: './add-entrada.component.scss'
})
export class AddEntradaComponent implements OnInit {

  formEntrance!: FormGroup;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  categorias: { id: string; name: string }[] = [];
  marcasFiltradas: { id: string; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEntradaComponent>,
    private dialog: MatDialog,
    private productoService: ProductoService,
    private cd: ChangeDetectorRef
  ) {

    this.formEntrance = this.fb.group({
      category: [''],
      marca: [''],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      serialNumbers: [[]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductosInventario().subscribe({
      next: (products) => {
        this.productos = products;

        this.categorias = [
          ...new Map(products.map(p => [p.category?.id, p.category])).values()
        ].filter(c => c != null) as any[];

        this.productosFiltrados = [...products];

        this.cd.detectChanges();
      },
      error: (fail) => console.error('Error al cargar productos', fail)
    });
  }

  filtrarPorCategoria(categoryId: string) {

    this.formEntrance.get('marca')?.setValue('');
    this.marcasFiltradas = [];

    if (!categoryId) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter(
      p => p.categoryId === categoryId
    );

    this.marcasFiltradas = [
      ...new Map(
        this.productosFiltrados
          .filter(p => p.marca)
          .map(p => [p.marca!.id, p.marca])
      ).values()
    ] as any[];

    this.cd.detectChanges();
  }

  filtrarPorMarca(marcaId: string) {

    const categoryId = this.formEntrance.get('category')?.value;

    this.productosFiltrados = this.productos.filter(p =>
      (categoryId ? p.categoryId === categoryId : true) &&
      (marcaId ? p.marcaId === marcaId : true)
    );

    this.cd.detectChanges();
  }

  addSerial(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value) {
    const current = this.formEntrance.get('serialNumbers')?.value || [];
    this.formEntrance.get('serialNumbers')?.setValue([...current, value]);
  }
  event.chipInput!.clear();
}

validateSerialNumbers(group: FormGroup) {

  const quantity = group.get('quantity')?.value;

  const serials: string[] =
    group.get('serialNumbers')?.value || [];

  if (!quantity) return null;
  
  if (serials.length === 0) {
    return { serialRequired: true };
  }
  if (serials.length !== quantity) {
    return { serialCountMismatch: true };
  }
  return null;
}

removeSerial(serial: string): void {
  const current = this.formEntrance.get('serialNumbers')?.value || [];
  this.formEntrance.get('serialNumbers')?.setValue(current.filter((s: string) => s !== serial));
}

  get product() { return this.formEntrance.get('product') as FormControl; }
  get quantity() { return this.formEntrance.get('quantity') as FormControl; }

  addEntrance() {
    if (this.formEntrance.invalid) {
      this.formEntrance.markAllAsTouched();
      return;
    }

    const formValue = this.formEntrance.value;
    const producto = this.productos.find(p => p.id === formValue.product);
    if (!producto) return;

    const newEntrada = {
      productId: producto.id,
      productName: producto.name,
      category: producto.category?.name,
      quantity: formValue.quantity,
      serialNumbers: formValue.serialNumbers
    };

    this.dialogRef.close(newEntrada);
  }
}
