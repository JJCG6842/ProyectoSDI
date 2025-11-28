import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-null',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './product-null.component.html',
  styleUrl: './product-null.component.scss'
})
export class ProductNullComponent {

}
