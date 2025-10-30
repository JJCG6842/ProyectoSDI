import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entradas-administrador',
  imports: [MatExpansionModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entradas-administrador.component.html',
  styleUrl: './entradas-administrador.component.scss'
})
export class EntradasAdministradorComponent {

  constructor(private router: Router){}

  kardex(){
    this.router.navigate(['/administrador/kardex-administrador'])
  }

  salidas(){
    this.router.navigate(['/administrador/salida-administrador'])
  }
}

