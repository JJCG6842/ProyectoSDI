import { ChangeDetectionStrategy, Component, inject, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { EntradaService } from '../../../services/entrada.service';
import { Producto } from '../../../interface/producto.interface';
import { Proveedor } from '../../../interface/proveedor.interface';
import { AddEntradaSuccessComponent } from './modals-entrada/add-entrada-success/add-entrada-success.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';


@Component({
  selector: 'app-add-entrada',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-entrada.component.html',
  styleUrl: './add-entrada.component.scss'
})
export class AddEntradaComponent implements OnInit{

  formEntrance!:  FormGroup;
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  isloading = false;

  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<AddEntradaComponent>, private dialog: MatDialog,
    private entradaService: EntradaService, private productoService: ProductoService, private proveedorService: ProveedorService
  ){
    this.formEntrance = this.fb.group({
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
    return this.formEntrance.get('product') as FormControl;
  }

  get provider(){
    return this.formEntrance.get('provider') as FormControl;
  }

  get quantity(){
    return this.formEntrance.get('quantity') as FormControl;
  }


  addEntrance(){
    if(this.formEntrance.invalid){
      this.formEntrance.markAllAsTouched();
      return;
    }

    const formValue = this.formEntrance.value;

    const newEntrada = {
      productId: formValue.product,
      supplierId: formValue.provider,
      quantity: formValue.quantity
    }

    this.entradaService.crearEntrada(newEntrada).subscribe({
      next:() => {
        this.dialogRef.close(true);
        this.dialog.open(AddEntradaSuccessComponent);
      },
      error: (error) => {
      console.error('Error al generar entrada:', error);
    },
    })
  }
}
