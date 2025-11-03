import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AlmacenesService } from '../../../../../services/almacen.service';
import { Almacen } from '../../../../../interface/almacen.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { EditAlmacenSuccessComponent } from '../modals-almacen/edit-almacen-success/edit-almacen-success.component';

@Component({
  selector: 'app-edit-almacen',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edit-almacen.component.html',
  styleUrl: './edit-almacen.component.scss'
})
export class EditAlmacenComponent implements OnInit {
  formAlmacen!: FormGroup;
  almacenes: Almacen[] = [];

  constructor(
    private fb: FormBuilder,
    private almacenesService: AlmacenesService,
    private dialogRef: MatDialogRef<EditAlmacenComponent>,
    private dialog: MatDialog
  ) {
    this.formAlmacen = this.fb.group({
      id: ['', Validators.required],
      newname: ['', Validators.required]
    });
  }

  get id() {
    return this.formAlmacen.get('id') as FormControl;
  }

  get newname() {
    return this.formAlmacen.get('newname') as FormControl;
  }

  ngOnInit() {
    // Cargar los almacenes existentes
    this.almacenesService.obtenerAlmacenes().subscribe({
      next: (data) => (this.almacenes = data),
      error: (err) => console.error('Error al cargar almacenes:', err)
    });
  }

  editar() {
    if (this.formAlmacen.invalid) return;

    const { id, newname } = this.formAlmacen.value;

    this.almacenesService.editarAlmacen(id, { name: newname }).subscribe({
      next: () => {
        this.dialog.open(EditAlmacenSuccessComponent);
        this.dialogRef.close(true); 
      },
      error: (err) => console.error('Error al editar almacén:', err)
    });
  }
}
