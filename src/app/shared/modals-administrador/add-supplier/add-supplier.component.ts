import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ProveedorService } from '../../../services/proveedor.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateSupplierSuccessComponent } from '../modals/create-supplier-success/create-supplier-success.component';

@Component({
  selector: 'app-add-supplier',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.scss'
})
export class AddSupplierComponent {
  formProveedor!: FormGroup;

  constructor(private fb: FormBuilder, private proveedorService: ProveedorService,
    private dialog: MatDialog, private dialogRef: MatDialogRef<AddSupplierComponent>
  ) {
    this.formProveedor = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required,Validators.minLength(9),Validators.maxLength(9),Validators.pattern(/^[0-9]+$/)]],
      description: ['', Validators.required],
      ruc: ['', [Validators.required,Validators.minLength(11),Validators.maxLength(11),Validators.pattern(/^[0-9]+$/)]],
      address: ['', Validators.required],
    });
  }

  get name() {
    return this.formProveedor.get('name') as FormControl;
  }

  get phone() {
    return this.formProveedor.get('phone') as FormControl;
  }

  get description() {
    return this.formProveedor.get('description') as FormControl;
  }

  get ruc() {
    return this.formProveedor.get('ruc') as FormControl;
  }

  get address() {
    return this.formProveedor.get('address') as FormControl;
  }

  agregar() {

    if (this.formProveedor.invalid) {
      this.formProveedor.markAllAsTouched();
      return;
    }

    const newSupplier = {
      ...this.formProveedor.value,
      phone: Number(this.formProveedor.value.phone),
    };

    this.proveedorService.crearProveedor(newSupplier).subscribe({
      next: (respuesta) => {
        console.log('Proveedor creado: ', respuesta);

        this.dialog.open(CreateSupplierSuccessComponent, {
          width: '400px',
          disableClose: true
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log('Error al crear el proveedor', err);
      }
    });
  }
}
