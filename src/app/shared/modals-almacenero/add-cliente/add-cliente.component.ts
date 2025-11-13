import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ClienteService } from '../../../services/cliente.service';
import { AddClienteSuccessComponent } from './modals-cliente/add-cliente-success/add-cliente-success.component';

@Component({
  selector: 'app-add-cliente',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-cliente.component.html',
  styleUrl: './add-cliente.component.scss'
})
export class AddClienteComponent {
  formCliente!: FormGroup;

  constructor(private fb:FormBuilder, private clienteService: ClienteService,
      private dialog:MatDialog, private dialogRef: MatDialogRef<AddClienteComponent>
    ){
      this.formCliente = this.fb.group({
        dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]]
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

    agregar(){
      if(this.formCliente.invalid){
        this.formCliente.markAllAsTouched();
        return;
      }

      const newCliente ={
        ...this.formCliente.value,
        phone: Number(this.formCliente.value.phone)
      };

      this.clienteService.crearCliente(newCliente).subscribe({
        next: (rpta) => {
          console.log('Cliente creado', rpta);

          this.dialog.open(AddClienteSuccessComponent,{
          width: '400px',
          disableClose: true
        });

        this.dialogRef.close(true);
        },
        error: (err) => {
        console.log('Error al crear el cliente', err);
      }
      })
    }
}
