import { ChangeDetectionStrategy, Component, inject, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { SalidaService } from '../../../services/salida.service';
import { Producto } from '../../../interface/producto.interface';
import { Proveedor } from '../../../interface/proveedor.interface';
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
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-salida.component.html',
  styleUrl: './add-salida.component.scss'
})
export class AddSalidaComponent implements OnInit{
  formSalida!:  FormGroup;
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  isloading = false;

  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<AddSalidaComponent>, private dialog: MatDialog,
    private salidaService: SalidaService, private productoService: ProductoService, private proveedorService: ProveedorService
  ){
    this.formSalida = this.fb.group({
      product: ['',Validators.required],
      provider: ['',Validators.required],
      quantity: ['',[Validators.required,Validators.min(1)]]
    });
  }

  ngOnInit(): void {
      this.cargarProductos();
      this.cargarProveedores();
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

  cargarProveedores(){
    this.proveedorService.getProveedores().subscribe({
      next: (proveedor) => {
        this.proveedores = proveedor;
      },
      error: (fail) =>{
        console.error('error al cargar proveedores', fail)
      },
    })
  }

  get product(){
    return this.formSalida.get('product') as FormControl;
  }

  get provider(){
    return this.formSalida.get('provider') as FormControl;
  }

  get quantity(){
    return this.formSalida.get('quantity') as FormControl;
  }

  addSalida(){
    if(this.formSalida.invalid){
      this.formSalida.markAllAsTouched();
      return;
    }

    const formValue = this.formSalida.value;

    const newSalida = {
      productId: formValue.product,
      supplierId: formValue.provider,
      quantity: formValue.quantity
    }

    this.salidaService.createSalida(newSalida).subscribe({
      next:() => {
        this.dialogRef.close(true);
        this.dialog.open(AddSalidaSuccessComponent)
      },
      error: (error) => {
      console.error('Error al generar salida:', error);
    },
    })
  }

}
