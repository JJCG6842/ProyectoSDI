import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef ,MatDialogModule} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AlmacenesService } from '../../../services/almacen.service';
import { AddAlmacenSuccessComponent } from './option-almacen/modals-almacen/add-almacen-success/add-almacen-success.component';

@Component({
  selector: 'app-add-almacen',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-almacen.component.html',
  styleUrl: './add-almacen.component.scss'
})
export class AddAlmacenComponent {
  formAlmacen: FormGroup;

  constructor(
    private fb: FormBuilder,
    private almacenesService: AlmacenesService,
    private dialogRef: MatDialogRef<AddAlmacenComponent>,
    private dialog:MatDialog
  ) {
    this.formAlmacen = this.fb.group({
      name: ['', Validators.required]
    });
  }

  get name() {
    return this.formAlmacen.get('name') as FormControl;
  }

  crear() {
    if (this.formAlmacen.invalid) return;

    const nuevoAlmacen = this.formAlmacen.value;

    this.almacenesService.crearAlmacen(nuevoAlmacen).subscribe({
      next: (almacenCreado) => {
        console.log('Almacén creado:', almacenCreado);

        this.dialog.open(AddAlmacenSuccessComponent);

        this.dialogRef.close(almacenCreado); 
      },
      error: (err) => console.error('Error al crear el almacén:', err)
    });
  }
}