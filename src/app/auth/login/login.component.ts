import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router){}

  login(){
    this.router.navigate(['/almacenero'])
  }
  
}
