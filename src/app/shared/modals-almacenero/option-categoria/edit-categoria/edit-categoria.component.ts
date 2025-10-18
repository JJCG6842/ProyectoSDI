import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CategoriaService } from '../../../../services/categoria.service';
import { EditCategorySuccessComponent } from '../edit-options/edit-category-success/edit-category-success.component';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Categoria } from '../../../../interface/categoria.interface';

@Component({
  selector: 'app-edit-categoria',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './edit-categoria.component.html',
  styleUrl: './edit-categoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCategoriaComponent {
  formCategoria!: FormGroup;

  constructor(private fb:FormBuilder,private categoriaService: CategoriaService,
    private dialogRef: MatDialogRef<EditCategoriaComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ){
    this.formCategoria = this.fb.group({
      name:[data?.name || '', Validators.required],
      description:[data?.description ||'', Validators.required]
    });
  }


  get name(){
    return this.formCategoria.get('name') as FormControl;
  }

  get description(){
    return this.formCategoria.get('description') as FormControl;
  }


  procesar(){
    if(this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    const updateData = this.formCategoria.value;

    this.categoriaService.actualizarCategoria(this.data.id!, updateData).subscribe({
      next: () => {
        this.dialog.open(EditCategorySuccessComponent,{
          width:'400px',
          disableClose: true,
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('error al actualizar datos :c',err);
      }
    });
  }
}
