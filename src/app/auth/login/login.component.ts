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
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', Validators.required]
    });
  }

  get nombre() {
    return this.formUser.get('nombre') as FormControl;
  }

  get lastname() {
    return this.formUser.get('lastname') as FormControl;
  }

  get email() {
    return this.formUser.get('email') as FormControl;
  }

  get dni() {
    return this.formUser.get('dni') as FormControl;
  }

  get password() {
    return this.formUser.get('password') as FormControl;
  }

  login() {
  if (this.formUser.invalid) {
    this.formUser.markAllAsTouched();
    return;
  }

  const { nombre, password, lastname, email, dni } = this.formUser.value;

  this.usuarioService.login(nombre, password, lastname, email, Number(dni)).subscribe({
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