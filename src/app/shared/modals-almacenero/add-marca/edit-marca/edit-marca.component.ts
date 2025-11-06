import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MarcaService } from '../../../../services/marca.service';
import { Marca } from '../../../../interface/marca.interface';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Categoria } from '../../../../interface/categoria.interface';
import { CategoriaService } from '../../../../services/categoria.service';
import { EditMarcaSuccessComponent } from '../modals-marca/edit-marca-success/edit-marca-success.component';

@Component({
  selector: 'app-edit-marca',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-marca.component.html',
  styleUrl: './edit-marca.component.scss'
})
export class EditMarcaComponent {
formMarca!: FormGroup;
  categorias: Categoria[] = [];

  constructor(private fb:FormBuilder, private marcaService: MarcaService, private dialogRef: MatDialogRef<EditMarcaComponent>,
    private dialog: MatDialog,private categoriaService: CategoriaService,
    @Inject(MAT_DIALOG_DATA) public data: Marca
  ){
    this.formMarca = this.fb.group({
      name: ['',Validators.required],
      description:['',Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void{
    this.cargarCategorias();

    if(this.data){
      this.formMarca.patchValue({
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
    return this.formMarca.get('name') as FormControl;
  }

  get description(){
    return this.formMarca.get('description') as FormControl;
  }

  get category(){
    return this.formMarca.get('category') as FormControl;
  }

  editar(){
    if(this.formMarca.invalid) return;

    const dataToSend = {
      name: this.name.value,
      description: this.description.value,
      categoryId: this.category.value
    };


    this.marcaService.editarMarca(this.data.id, dataToSend).subscribe({
      next:() => {
        this.dialog.open(EditMarcaSuccessComponent,{
          width:'400px',disableClose: true});
          this.dialogRef.close(true);
      },
      error: (erroneo) => {
        console.error('error al editar la marca', erroneo);
      }
    })
  }
}
