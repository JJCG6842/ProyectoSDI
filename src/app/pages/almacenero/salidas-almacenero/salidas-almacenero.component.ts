import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salidas-almacenero',
  imports: [MatExpansionModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-almacenero.component.html',
  styleUrl: './salidas-almacenero.component.scss'
})
export class SalidasAlmaceneroComponent {

  constructor(private router: Router){}

  kardex(){
    this.router.navigate(['/almacenero/kardex-almacenero'])
  }

  salidas(){
    this.router.navigate(['/almacenero/entrada-almacenero'])
  }
}
