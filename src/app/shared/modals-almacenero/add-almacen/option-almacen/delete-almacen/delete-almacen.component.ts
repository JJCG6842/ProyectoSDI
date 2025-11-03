import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AlmacenesService } from '../../../../../services/almacen.service';
import { Almacen } from '../../../../../interface/almacen.interface';
import { DeleteAlmacenConfirmComponent } from '../modals-almacen/delete-almacen-confirm/delete-almacen-confirm.component';
import { DeleteAlmacenSuccessComponent } from '../modals-almacen/delete-almacen-success/delete-almacen-success.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-almacen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './delete-almacen.component.html',
  styleUrl: './delete-almacen.component.scss'
})
export class DeleteAlmacenComponent implements OnInit {
  formAlmacen!: FormGroup;
  almacenes: Almacen[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteAlmacenComponent>,
    private almacenesService: AlmacenesService,
    private cdr: ChangeDetectorRef
  ) {
    this.formAlmacen = this.fb.group({
      id: ['', Validators.required],
    });
  }

  get id() {
    return this.formAlmacen.get('id') as FormControl;
  }

  ngOnInit() {
    this.almacenesService.obtenerAlmacenes().subscribe({
      next: (data) => (this.almacenes = data),
      error: (err) => console.error('Error al cargar almacenes:', err),
    });
  }

  cargarAlmacenes(){
    this.almacenesService.obtenerAlmacenes().subscribe({
      next:(data) => {
        this.almacenes = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar almacenes', err)
    });
  }

  eliminar() {
    if (this.formAlmacen.invalid) return;

    const id = this.formAlmacen.value.id;
    const almacenSeleccionado = this.almacenes.find(a => a.id === id);

    const confirmDialog = this.dialog.open(DeleteAlmacenConfirmComponent, {
      width: '40%',
      data: { nombre: almacenSeleccionado?.name },
    });

    confirmDialog.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.almacenesService.eliminarAlmacen(id).subscribe({
          next: () => {
            this.dialog.open(DeleteAlmacenSuccessComponent, {
              width: '40%',
              data: { nombre: almacenSeleccionado?.name },
              disableClose: true
            });
            
            this.cargarAlmacenes();
            
            this.dialogRef.close(id);
          },
          error: (err) => console.error('Error al eliminar almacén:', err),
        });
      }
    });
  }
}