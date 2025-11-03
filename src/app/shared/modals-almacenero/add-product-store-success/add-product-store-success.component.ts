import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-store-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './add-product-store-success.component.html',
  styleUrl: './add-product-store-success.component.scss'
})
export class AddProductStoreSuccessComponent {

}
