import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-product-store-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-product-store-success.component.html',
  styleUrl: './delete-product-store-success.component.scss'
})
export class DeleteProductStoreSuccessComponent {

}
