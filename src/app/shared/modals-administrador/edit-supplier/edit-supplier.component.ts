import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Proveedor } from '../../../interface/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { EditSupplierSuccessComponent } from '../modals/edit-supplier-success/edit-supplier-success.component';

@Component({
  selector: 'app-edit-supplier',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.scss'
})
export class EditSupplierComponent {
  formProveedor!: FormGroup;

  constructor(private fb: FormBuilder, private proveedorService: ProveedorService,
    private dialog: MatDialog, private dialogRef: MatDialogRef<EditSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor
  ) {
    this.formProveedor = this.fb.group({
      name: [data?.name || '', Validators.required],
      phone: [data?.phone || '', [Validators.required,Validators.minLength(9),Validators.maxLength(9),Validators.pattern(/^[0-9]+$/)]],
      ruc: [data?.ruc || '', [Validators.required,Validators.minLength(11),Validators.maxLength(11),Validators.pattern(/^[0-9]+$/)]],
      address: [data?.address || '', Validators.required],
      description: [data?.description || '', Validators.required]
    });
  }

  get name() {
    return this.formProveedor.get('name') as FormControl;
  }

  get ruc() { 
    return this.formProveedor.get('ruc') as FormControl; 
  }
  
  get address() { 
    return this.formProveedor.get('address') as FormControl; 
  }

  get phone() {
    return this.formProveedor.get('phone') as FormControl;
  }

  get description() {
    return this.formProveedor.get('description') as FormControl;
  }

  editar() {
  if (this.formProveedor.invalid) {
    this.formProveedor.markAllAsTouched();
    return;
  }

  const updateData = {
    ...this.formProveedor.value,
    phone: Number(this.formProveedor.value.phone)  
  };

  this.proveedorService.actualizarProveedor(this.data.id!, updateData).subscribe({
    next: () => {
      this.dialog.open(EditSupplierSuccessComponent);
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.log('Error al actualizar los datos', err);
    }
  });
}

}
