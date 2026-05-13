import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { SubcategoriaService } from '../../../services/subcategoria.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateSubcategorySuccessComponent } from './modals-subcategoria/create-subcategory-success/create-subcategory-success.component';
import { Categoria } from '../../../interface/categoria.interface';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-add-subcategoria',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './add-subcategoria.component.html',
  styleUrl: './add-subcategoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSubcategoriaComponent implements OnInit{
  formSubcategory!: FormGroup;
  categorias: Categoria[] = [];

  constructor(private fb:FormBuilder, private subcategoriaService : SubcategoriaService,
    private dialogRef: MatDialogRef<AddSubcategoriaComponent>, private dialog: MatDialog, 
    private categoriaService: CategoriaService
  ){
    this.formSubcategory = this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required],
      categories: [[], Validators.required],
    });
  }

  ngOnInit(): void{
    this.cargarCategorias();
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

  get name(){
    return this.formSubcategory.get('name') as FormControl;
  }

  get description(){
    return this.formSubcategory.get('description') as FormControl;
  }

  get categories(){
    return this.formSubcategory.get('categories') as FormControl;
  }

  process(){
    if (this.formSubcategory.invalid){
      this.formSubcategory.markAllAsTouched();
      return
    };

    const data = {
      name: this.name.value,
      description: this.description.value,
      categoryIds: this.categories.value
    };

    this.subcategoriaService.crearSubcategoria(data).subscribe({
    next: () => {
      this.dialog.open(CreateSubcategorySuccessComponent, {
        width: '400px',
        disableClose: true
      });

      this.dialogRef.close(true);
    },
    error: (fail) => {
      console.error('Error al crear subcategoria', fail);
    }
  });
  }
}
