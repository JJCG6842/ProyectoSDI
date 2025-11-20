import { ChangeDetectionStrategy, Component, inject, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { SalidaService } from '../../../services/salida.service';
import { Producto } from '../../../interface/producto.interface';
import { AddSalidaSuccessComponent } from './modals-salida/add-salida-success/add-salida-success.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-salida',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule,MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-salida.component.html',
  styleUrl: './add-salida.component.scss'
})
export class AddSalidaComponent implements OnInit{
  formSalida!:  FormGroup;
  productos: Producto[] = [];
  isloading = false;
  stockError: string = '';

  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<AddSalidaComponent>, private dialog: MatDialog,
    private productoService: ProductoService,private cd: ChangeDetectorRef, private salidaService: SalidaService){
    this.formSalida = this.fb.group({
      product: ['',Validators.required],
      quantity: ['',[Validators.required,Validators.min(1)]]
    });
  }
  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(){
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
      },
      error: (fail) =>{
        console.error('error al cargar productos', fail)
      },
    })
  }

  get product() {
    return this.formSalida.get('product') as FormControl;
  }

  get quantity() {
    return this.formSalida.get('quantity') as FormControl;
  }

  addSalida() {
  this.stockError = '';

  if (this.formSalida.invalid) {
    this.formSalida.markAllAsTouched();
    return;
  }

  const formValue = this.formSalida.value;
  const producto = this.productos.find(p => p.id === formValue.product);

  if (!producto) return;

  if (producto.quantity <= 0) {
    this.stockError = `El producto "${producto.name}" no tiene stock disponible.`;
    this.cd.detectChanges();
    return;
  }

  if (formValue.quantity > producto.quantity) {
    this.stockError = `La cantidad ingresada supera el stock disponible (${producto.quantity}).`;
    this.cd.detectChanges();
    return;
  }

  const newSalida = {
    productId: producto.id,
    productCategory: producto.category?.name,
    productName: producto.name,
    quantity: formValue.quantity,
    price: producto.price,
    total: producto.price * formValue.quantity
  };

  this.dialogRef.close(newSalida); 
}

}
