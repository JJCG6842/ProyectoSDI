import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kardex-almacenero',
  imports: [MatExpansionModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kardex-almacenero.component.html',
  styleUrl: './kardex-almacenero.component.scss'
})
export class KardexAlmaceneroComponent {

  constructor(private router: Router){}



  entradas(){
    this.router.navigate(['/almacenero/entrada-almacenero'])
  }

  salidas(){
    this.router.navigate(['/almacenero/salida-almacenero'])
  }
}
