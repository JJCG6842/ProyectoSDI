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
  selector: 'app-add-subcategoria',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './add-subcategoria.component.html',
  styleUrl: './add-subcategoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSubcategoriaComponent {
  formSubcategory!: FormGroup;

  constructor(private fb:FormBuilder){
    this.formSubcategory = this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required],
      category: ['', Validators.required],
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

  process(){
    console.log()
  }
}
