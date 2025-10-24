import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { ProductoService } from '../../../../services/producto.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interface/categoria.interface';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { Subcategoria } from '../../../../interface/subcategoria.interface';
import { Producto } from '../../../../interface/producto.interface';
import { EditProductSuccessComponent } from '../modals-producto/edit-product-success/edit-product-success.component';

@Component({
  selector: 'app-edit-product',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  formProduct!:  FormGroup;
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];

  constructor(private fb:FormBuilder, private productoService: ProductoService, 
    private dialogRef: MatDialogRef<EditProductComponent>, private dialog: MatDialog,
    private categoriaService: CategoriaService,private subcategoriaService : SubcategoriaService,
    @Inject(MAT_DIALOG_DATA) public data: Producto){
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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

    if (this.data) {
    this.formProduct.patchValue({
      name: this.data.name,
      description: this.data.description,
      marca: this.data.marca,
      model: this.data.model,
      image: this.data.image,
      category: this.data.categoryId,
      subcategory: this.data.subcategoryId,
      price: this.data.price,
      quantity: this.data.quantity,
    });
  }
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

  editProduct(){
    if (this.formProduct.invalid) {
    this.formProduct.markAllAsTouched();
    return;
  }

  const formValue = this.formProduct.value;

  const status: 'Instock' | 'Outstock' = formValue.quantity === 0 ? 'Outstock' : 'Instock';

  const updatedProduct = {
    name: this.name.value,
    description: this.description.value,
    marca: this.marca.value,
    model: this.model.value,
    image: this.image.value,
    price: this.price.value,
    quantity: this.quantity.value,
    status,
    categoryId: this.category.value,
    subcategoryId: this.subcategory.value,
  };

  this.productoService.actualizarProducto(this.data.id, updatedProduct).subscribe({
    next: () => {
      this.dialog.open(EditProductSuccessComponent,{
          width:'400px',disableClose: true,});
      this.dialogRef.close(true); 
    },
    error: (err) => {
      console.error('Error al actualizar producto:', err);
    },
  });
  }
}
