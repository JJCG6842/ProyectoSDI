import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import {FormControl,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GuiaRemisionService } from '../../../../services/guia_remision.service';

@Component({
  selector: 'app-edit-guia',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatSelectModule,MatButtonModule],
  templateUrl: './edit-guia.component.html',
  styleUrl: './edit-guia.component.scss'
})
export class EditGuiaComponent {

  estado = new FormControl(
    '',
    Validators.required
  );

  loading = false;

  constructor(
    private guiaService: GuiaRemisionService,

    private dialogRef:
      MatDialogRef<EditGuiaComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {

    this.estado.setValue(
      data.estado
    );

  }

  guardarCambios() {

    if (this.estado.invalid) return;

    this.loading = true;

    const payload = {
      estado: this.estado.value
    };

    this.guiaService
      .actualizarGuia(
        this.data.id,
        payload
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.dialogRef.close(true);

        },

        error: (err) => {

          this.loading = false;

          console.error(
            'Error al actualizar guía',
            err
          );

        }

      });

  }

  cerrar() {
    this.dialogRef.close(false);
  }

}
