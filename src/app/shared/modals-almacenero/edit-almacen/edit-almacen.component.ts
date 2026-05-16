
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Almacen } from '../../../interface/almacen.interface';
import { AlmacenService } from '../../../services/almacen.service';
import { EditAlmacenSuccessComponent } from './edit-almacen-success/edit-almacen-success.component';

@Component({
  selector: 'app-edit-almacen',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule,
    MatButtonModule],
  templateUrl: './edit-almacen.component.html',
  styleUrl: './edit-almacen.component.scss',
})

export class EditAlmacenComponent {

  formAlmacen!: FormGroup;

  constructor( private fb: FormBuilder, private dialogRef: MatDialogRef<EditAlmacenComponent>, 
    private almacenService: AlmacenService, private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: Almacen ) {

    this.formAlmacen = this.fb.group({

      nombre: [
        data.nombre,
        Validators.required
      ],

      direccion: [
        data.direccion,
        Validators.required
      ],

      telefono: [
        data.telefono,
        Validators.required
      ],

      descripcion: [
        data.descripcion,
        Validators.required
      ],
    });
  }

  get nombre() {
    return this.formAlmacen.get('nombre')!;
  }

  get direccion() {
    return this.formAlmacen.get('direccion')!;
  }

  get telefono() {
    return this.formAlmacen.get('telefono')!;
  }

  get descripcion() {
    return this.formAlmacen.get('descripcion')!;
  }


editAlmacen() {

  if (this.formAlmacen.invalid) {
    this.formAlmacen.markAllAsTouched();
    return;
  }

  this.almacenService.actualizarAlmacen(
    this.data.id,
    this.formAlmacen.value
  )
  .subscribe({

    next: (res) => {

      console.log(
        'Almacén actualizado',
        res
      );

      this.dialog.open(EditAlmacenSuccessComponent,
        {
          width: '400px',
          disableClose: true,
        }
      );

      this.dialogRef.close(true);
    },

    error: (err) => {

      console.error(
        'Error al actualizar almacén',
        err
      );
    },
  });
}

}

