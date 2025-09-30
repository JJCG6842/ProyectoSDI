import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

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

  constructor(private fb:FormBuilder){
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
    console.log()
  }
}
