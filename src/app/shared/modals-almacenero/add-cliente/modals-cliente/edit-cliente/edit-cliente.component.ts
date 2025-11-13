import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ClienteService } from '../../../../../services/cliente.service';
import { Cliente } from '../../../../../interface/cliente.interface';
import { EditClienteSuccessComponent } from '../edit-cliente-success/edit-cliente-success.component';


@Component({
  selector: 'app-edit-cliente',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-cliente.component.html',
  styleUrl: './edit-cliente.component.scss'
})
export class EditClienteComponent {
formCliente!: FormGroup;

  constructor(private fb:FormBuilder, private clienteService: ClienteService,
      private dialog:MatDialog, private dialogRef: MatDialogRef<EditClienteComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Cliente
    ){
      this.formCliente = this.fb.group({
        dni: [data?.dni || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        name: [data?.name || '', Validators.required],
        phone: [data.phone || '', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]]
      });
    }

    get dni(){
      return this.formCliente.get('dni') as FormControl;
    }

    get name(){
      return this.formCliente.get('name') as FormControl;
    }

    get phone(){
      return this.formCliente.get('phone') as FormControl;
    }

    editar() {

      if (this.formCliente.invalid) {
        this.formCliente.markAllAsTouched();
        return;
      }

  const updateData = {
    dni: Number(this.formCliente.value.dni),
    name: this.formCliente.value.name,
    phone: Number(this.formCliente.value.phone)
  };

  this.clienteService.actualizarCliente(this.data.id!, updateData).subscribe({
    next: () => {
      this.dialog.open(EditClienteSuccessComponent);
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.error('Error al actualizar los datos', err);
    }
  });
}
}
