import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salidas-administrador',
  imports: [MatExpansionModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-administrador.component.html',
  styleUrl: './salidas-administrador.component.scss'
})
export class SalidasAdministradorComponent {

  constructor(private router: Router){}

  kardex(){
    this.router.navigate(['/administrador/kardex-administrador'])
  }

  salidas(){
    this.router.navigate(['/administrador/entrada-administrador'])
  }
}

