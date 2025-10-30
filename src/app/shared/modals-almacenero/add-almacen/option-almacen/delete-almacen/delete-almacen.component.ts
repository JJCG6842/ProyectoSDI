import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule ,MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeleteAlmacenConfirmComponent } from '../modals-almacen/delete-almacen-confirm/delete-almacen-confirm.component';
import { DeleteAlmacenSuccessComponent } from '../modals-almacen/delete-almacen-success/delete-almacen-success.component';

@Component({
  selector: 'app-delete-almacen',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, CommonModule,
    FormsModule, ReactiveFormsModule,MatSelectModule],
  templateUrl: './delete-almacen.component.html',
  styleUrl: './delete-almacen.component.scss'
})
export class DeleteAlmacenComponent {


formAlmacen!: FormGroup;

  constructor(private fb:FormBuilder,private dialog:MatDialog, private dialogRef: MatDialogRef<DeleteAlmacenComponent>){
    this.formAlmacen = this.fb.group({
      name:['',Validators.required]
    });
  }

  get name(){
    return this.formAlmacen.get('name') as FormControl;
  }

  eliminar(){
    const dialogRef = this.dialog.open(DeleteAlmacenConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
