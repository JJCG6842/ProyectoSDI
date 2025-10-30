import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule ,MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-almacen',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-almacen.component.html',
  styleUrl: './add-almacen.component.scss'
})
export class AddAlmacenComponent {
  formAlmacen!: FormGroup;

  constructor(private fb:FormBuilder,private dialog:MatDialog, private dialogRef: MatDialogRef<AddAlmacenComponent>){
    this.formAlmacen = this.fb.group({
      name:['',Validators.required]
    });
  }

  get name(){
    return this.formAlmacen.get('name') as FormControl;
  }

  crear(){

  }


}
