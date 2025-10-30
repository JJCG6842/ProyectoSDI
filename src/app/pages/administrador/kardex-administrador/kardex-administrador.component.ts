import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kardex-administrador',
  imports: [MatExpansionModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kardex-administrador.component.html',
  styleUrl: './kardex-administrador.component.scss'
})
export class KardexAdministradorComponent {

  constructor(private router: Router){}



  entradas(){
    this.router.navigate(['/administrador/entrada-administrador'])
  }

  salidas(){
    this.router.navigate(['/administrador/salida-administrador'])
  }
}


