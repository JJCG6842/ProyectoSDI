import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { SubcategoriaService } from '../../../../../services/subcategoria.service';
import { Subcategoria } from '../../../../../interface/subcategoria.interface';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Categoria } from '../../../../../interface/categoria.interface';
import { CategoriaService } from '../../../../../services/categoria.service';
import { EditSubcategorySuccessComponent } from '../../modals-subcategoria/edit-subcategory-success/edit-subcategory-success.component';

@Component({
  selector: 'app-edit-subcategory',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './edit-subcategory.component.html',
  styleUrl: './edit-subcategory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSubcategoryComponent implements OnInit{
  formSubcategory!: FormGroup;
  categorias: Categoria[] = [];

  constructor(private fb:FormBuilder, private subcategoriaService : SubcategoriaService,
    private dialog: MatDialog, 
    private categoriaService: CategoriaService,private dialogRef: MatDialogRef<EditSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Subcategoria
  ){
    this.formSubcategory = this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void{
    this.cargarCategorias();

    if(this.data){
      this.formSubcategory.patchValue({
        name: this.data.name,
        description: this.data.description,
        category: this.data.category.id
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

  get name(){
    return this.formSubcategory.get('name') as FormControl;
  }

  get description(){
    return this.formSubcategory.get('description') as FormControl;
  }

  get category(){
    return this.formSubcategory.get('category') as FormControl;
  }

  editar(){
    if(this.formSubcategory.invalid) return;

    const dataToSend = {
      name: this.name.value,
      description: this.description.value,
      categoryId: this.category.value
    };

    

    this.subcategoriaService.actualizarSubcategoria(this.data.id, dataToSend).subscribe({
      next:() => {
        this.dialog.open(EditSubcategorySuccessComponent,{
                width:'400px',disableClose: true,});
        this.dialogRef.close(true);
      },
      error: (erroneo) => {
        console.error('error al editar la subcategoria', erroneo);
      }
    })
  }
}
