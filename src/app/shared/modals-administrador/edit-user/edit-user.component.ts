import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../interface/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { EditUserSuccessComponent } from '../modals/edit-user-success/edit-user-success.component';

@Component({
  selector: 'app-edit-user',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule, TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class editUserComponent {

  formUser!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<editUserComponent>,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    this.formUser = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      lastname: [data?.lastname || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      dni: [data?.dni || '', [Validators.required, Validators.pattern('^[0-9]+$'),Validators.required,Validators.minLength(8),Validators.maxLength(8)]],
      password: ['']
    });
  }

  get nombre() { return this.formUser.get('nombre') as FormControl; }
  get lastname() { return this.formUser.get('lastname') as FormControl; }
  get email() { return this.formUser.get('email') as FormControl; }
  get dni() { return this.formUser.get('dni') as FormControl; }
  get password() { return this.formUser.get('password') as FormControl; }

  editUser() {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
      return;
    }

    const updateData = { ...this.formUser.value };
    if (updateData.dni) updateData.dni = Number(updateData.dni);
    if (!updateData.password) delete updateData.password;

    this.usuarioService.actualizarUsuario(this.data.id!, updateData).subscribe({
      next: () => {
        this.dialog.open(EditUserSuccessComponent, {
          width: '400px',
          disableClose: true,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log('Error al actualizar los datos', err);
      }
    });
  }

}
