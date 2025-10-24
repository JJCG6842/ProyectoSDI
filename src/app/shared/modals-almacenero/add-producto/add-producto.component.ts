import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { ProductoService } from '../../../services/producto.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
import { SubcategoriaService } from '../../../services/subcategoria.service';
import { Subcategoria } from '../../../interface/subcategoria.interface';
import { CreateProductSuccessComponent } from './modals-producto/create-product-success/create-product-success.component';

@Component({
  selector: 'app-add-producto',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './add-producto.component.html',
  styleUrl: './add-producto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductoComponent implements OnInit{

  formProduct!:  FormGroup;
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];

  constructor(private fb:FormBuilder, private productoService: ProductoService, 
    private dialogRef: MatDialogRef<AddProductoComponent>, private dialog: MatDialog,
    private categoriaService: CategoriaService,private subcategoriaService : SubcategoriaService){
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      description: ['',Validators.required],
      marca: ['', Validators.required],
      model: ['', Validators.required],
      image: [''],
      category: ['',Validators.required],
      subcategory: ['', Validators.required],
      price: ['', [Validators.required,Validators.min(1)]],
      quantity: ['', [Validators.required,Validators.min(0)]],
    });
  }

  ngOnInit(): void{
    this.cargarCategorias();
    this.cargarSubcategorias();
  }

  cargarCategorias(){
    this.categoriaService.getCategorias().subscribe({
      next: (categorys) => {
        this.categorias = categorys;
      },
      error: (fail) =>{
        console.error('error al cargar categorias', fail)
      },
    });
  }

  cargarSubcategorias(){
    this.subcategoriaService.getSubcategoria().subscribe({
      next: (subcategorys) => {
        this.subcategorias = subcategorys;
      },
      error: (fail) =>{
        console.error('error al cargar subcategorias', fail)
      },
    });
  }


  get name(){
    return this.formProduct.get('name') as FormControl;
  }

  get description(){
    return this.formProduct.get('description') as FormControl;
  }

  get marca(){
    return this.formProduct.get('marca') as FormControl;
  }

  get model(){
    return this.formProduct.get('model') as FormControl;
  }

  get image(){
    return this.formProduct.get('image') as FormControl;
  }

  get category(){
    return this.formProduct.get('category') as FormControl;
  }

  get subcategory(){
    return this.formProduct.get('subcategory') as FormControl;
  }

  get price(){
    return this.formProduct.get('price') as FormControl;
  }

  get quantity(){
    return this.formProduct.get('quantity') as FormControl;
  }

  addProduct(){
    if(this.formProduct.invalid){
      this.formProduct.markAllAsTouched();
      return;
    }

    const formValue = this.formProduct.value;

    const status: 'Instock' | 'Outstock' = formValue.quantity === 0 ? 'Outstock' : 'Instock';

    const newProduct = {
      partnumber: formValue.partnumber,
      image: formValue.image,
      name: formValue.name,
      description: formValue.description,
      marca: formValue.marca,
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      status, 
      model: formValue.model,
      categoryId: formValue.category,
      subcategoryId: formValue.subcategory
    }

    this.productoService.crearProducto(newProduct).subscribe({
    next: () => {
        this.dialogRef.close(true);
        this.dialog.open(CreateProductSuccessComponent);
    },
    error: (error) => {
      console.error('Error al crear el producto:', error);
    },
  })
  }
}
