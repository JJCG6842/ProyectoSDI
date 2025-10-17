import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { CategoriaService } from '../../../services/categoria.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateCategorySuccessComponent } from '../option-categoria/create-categoria/create-category-success/create-category-success.component';

@Component({
  selector: 'app-add-categoria',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './add-categoria.component.html',
  styleUrl: './add-categoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoriaComponent {
  formCategoria!: FormGroup;

  constructor(private fb:FormBuilder, private categoriaService: CategoriaService,
    private dialog:MatDialog, private dialogRef: MatDialogRef<AddCategoriaComponent>
  ){
    this.formCategoria = this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required]
    });
  }


  get name(){
    return this.formCategoria.get('name') as FormControl;
  }

  get description(){
    return this.formCategoria.get('description') as FormControl;
  }


  procesar(){

    if (this.formCategoria.invalid){
      this.formCategoria.markAllAsTouched();
      return;
    }

    const newCategory = this.formCategoria.value;

    this.categoriaService.crearCategoria(newCategory).subscribe({
      next:(respuesta) =>{
        console.log('Categoria creada: ', respuesta);
        

        this.dialog.open(CreateCategorySuccessComponent,{
          width: '400px',
          disableClose: true
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log('error al crear categoria')
      }
    });

  }
}
