import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MarcaService } from '../../../services/marca.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AddMarcaSuccessComponent } from './modals-marca/add-marca-success/add-marca-success.component';
import { Categoria } from '../../../interface/categoria.interface';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-add-marca',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-marca.component.html',
  styleUrl: './add-marca.component.scss'
})
export class AddMarcaComponent implements OnInit{

  formMarca!: FormGroup;
  categorias: Categoria[] = [];

  constructor(private fb:FormBuilder, private marcaService: MarcaService, private dialogRef: MatDialogRef<AddMarcaComponent>,
    private dialog: MatDialog,private categoriaService: CategoriaService
  ){
    this.formMarca = this.fb.group({
      name: ['',Validators.required],
      description:['',Validators.required],
      category: ['', Validators.required],
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
    return this.formMarca.get('name') as FormControl;
  }

  get description(){
    return this.formMarca.get('description') as FormControl;
  }

  get category(){
    return this.formMarca.get('category') as FormControl;
  }

  

  create(){
    if(this.formMarca.invalid){
      this.formMarca.markAllAsTouched();
    }

    const data = {
      name: this.name.value,
      description: this.description.value,
      categoryId: this.category.value
    };

    this.marcaService.crearMarca(data).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.dialog.open(AddMarcaSuccessComponent);
      },
      error: (fail) => {
        console.error('Error al crear la marca', fail);
      },
    })
  }

}
