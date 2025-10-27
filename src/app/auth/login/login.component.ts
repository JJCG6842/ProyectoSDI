import { Component ,ChangeDetectionStrategy} from '@angular/core';
import { AppComponent } from "../../app.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,MatFormFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formUser!: FormGroup;

  constructor(private router: Router,private fb:FormBuilder, 
    private usuarioService: UsuarioService){
      this.formUser = this.fb.group({
        nombre: ['', Validators.required],
        password: ['', Validators.required]
      });
    }

    get nombre(){
      return this.formUser.get('nombre') as FormControl;
    }

    get password(){
      return this.formUser.get('password') as FormControl;
    }



  login() {
  if (this.formUser.invalid) {
    this.formUser.markAllAsTouched();
    return;
  }

  const { nombre, password } = this.formUser.value;

  this.usuarioService.login(nombre, password).subscribe({
    next: (res) => {
      console.log('Login correcto:', res);
      alert(`Bienvenido ${res.user.nombre} 👋`);
      
      if (res.user.role === 'Administrador') {
        this.router.navigate(['/administrador']);
      } else {
        this.router.navigate(['/almacenero']);
      }
    },
    error: (err) => {
      console.error('Error de login:', err);
      alert('Usuario o contraseña incorrectos');
    },
  });
}
  
}
