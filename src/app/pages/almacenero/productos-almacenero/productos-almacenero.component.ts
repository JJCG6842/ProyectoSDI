import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-productos-almacenero',
  imports: [MatIconModule, MatExpansionModule],
  templateUrl: './productos-almacenero.component.html',
  styleUrl: './productos-almacenero.component.scss'
})
export class ProductosAlmaceneroComponent {
  isExpanded = false;

  togglePanel(): void {
    this.isExpanded = !this.isExpanded;
  }
}
