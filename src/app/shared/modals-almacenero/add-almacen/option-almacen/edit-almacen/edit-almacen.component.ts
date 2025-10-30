import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule ,MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule, MatInput } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardActions } from "@angular/material/card";

@Component({
  selector: 'app-edit-almacen',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, CommonModule,
    FormsModule, ReactiveFormsModule,MatSelectModule],
  templateUrl: './edit-almacen.component.html',
  styleUrl: './edit-almacen.component.scss'
})
export class EditAlmacenComponent {
formAlmacen!: FormGroup;

  constructor(private fb:FormBuilder,private dialog:MatDialog, private dialogRef: MatDialogRef<EditAlmacenComponent>){
    this.formAlmacen = this.fb.group({
      name:['',Validators.required],
      newname:['',Validators.required]
    });
  }

  get name(){
    return this.formAlmacen.get('name') as FormControl;
  }

  get newname(){
    return this.formAlmacen.get('newname') as FormControl;
  }



  editar(){

  }
}
