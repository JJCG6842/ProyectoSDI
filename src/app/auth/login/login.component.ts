import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RtlScrollAxisType } from '@angular/cdk/platform';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  formUser!: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.formUser = this.fb.group({
      nombre: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get nombre() {
    return this.formUser.get('nombre') as FormControl;
  }

  get password(){
    return this.formUser.get('password') as FormControl
  }


  login() {
  if (this.formUser.invalid) {
    this.formUser.markAllAsTouched();
    return;
  }

  const { nombre, password } = this.formUser.value;

  this.usuarioService.login(nombre, password).subscribe({
    next: (res) => {
      const user = res.user;
      localStorage.setItem('usuario', JSON.stringify(user));
      if (user.role === 'Administrador') {
        this.router.navigate(['/administrador']);
      } else {
        this.router.navigate(['/almacenero']);
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Credenciales incorrectas';
    }
  });
}
}