import { ChangeDetectionStrategy, Component, inject, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../interface/cliente.interface';
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
  clientes: Cliente[] = [];
  isloading = false;
  tipoDestino: 'proveedor' | 'cliente' | '' = '';

  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<AddSalidaComponent>, private dialog: MatDialog,
    private salidaService: SalidaService, private productoService: ProductoService, private proveedorService: ProveedorService
  , private clienteService: ClienteService,private cd: ChangeDetectorRef){
    this.formSalida = this.fb.group({
      product: ['',Validators.required],
      tipoDestino: ['',Validators.required],
      provider: [''],
      cliente: [''],
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

  onTipoDestinoChange(tipo: string) {
    this.tipoDestino = tipo as 'proveedor' | 'cliente';

    this.formSalida.patchValue({ provider: '', cliente: '' });

    if (tipo === 'proveedor') {
      this.cargarProveedores();
      this.formSalida.get('provider')?.setValidators([Validators.required]);
      this.formSalida.get('cliente')?.clearValidators();
    } else if (tipo === 'cliente') {
      this.cargarClientes();
      this.formSalida.get('cliente')?.setValidators([Validators.required]);
      this.formSalida.get('provider')?.clearValidators();
    }

    this.formSalida.get('provider')?.updateValueAndValidity();
    this.formSalida.get('cliente')?.updateValueAndValidity();

    this.cd.markForCheck();
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

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  get product() {
    return this.formSalida.get('product') as FormControl;
  }
  get provider() {
    return this.formSalida.get('provider') as FormControl;
  }
  get cliente() {
    return this.formSalida.get('cliente') as FormControl;
  }
  get quantity() {
    return this.formSalida.get('quantity') as FormControl;
  }

  addSalida() {
  if (this.formSalida.invalid) {
    this.formSalida.markAllAsTouched();
    return;
  }

  const formValue = this.formSalida.value;

  const newSalida: any = {
    productId: formValue.product,
    quantity: formValue.quantity,
  };

  if (this.tipoDestino === 'proveedor') {
    newSalida.supplierId = formValue.provider;
  } else if (this.tipoDestino === 'cliente') {
    newSalida.clienteId = formValue.cliente;
  }

  this.salidaService.createSalida(newSalida).subscribe({
    next: () => {
      this.dialogRef.close(true);
      this.dialog.open(AddSalidaSuccessComponent);
    },
    error: (error) => {
      console.error('Error al generar salida:', error);
    },
  });
}

}
