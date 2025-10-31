import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateUserSuccessComponent } from '../modals/create-user-success/create-user-success.component';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-add-user',
  imports: [MatDialogModule, MatFormFieldModule, MatInput, MatSelectModule,MatButtonModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  formUser!: FormGroup;

  constructor(private fb:FormBuilder,private dialog:MatDialog, 
    private usuarioService: UsuarioService,private dialogRef: MatDialogRef<AddUserComponent>){
    this.formUser = this.fb.group({
      nombre: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  get nombre(){
    return this.formUser.get('nombre') as FormControl;
  }

  get password(){
    return this.formUser.get('password') as FormControl;
  }


  addUser(){
    if(this.formUser.invalid){
      this.formUser.markAllAsTouched();
      return;
    }

    const newUser = this.formUser.value;

    this.usuarioService.crearUsuario(newUser).subscribe({
      next:(respuesta)=>{
        console.log('Usuario creado: ', respuesta);

        this.dialog.open(CreateUserSuccessComponent,{
          width: '400px',
          disableClose: true
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log('Error al crear usuario', err);
      }
    });
  }

}
