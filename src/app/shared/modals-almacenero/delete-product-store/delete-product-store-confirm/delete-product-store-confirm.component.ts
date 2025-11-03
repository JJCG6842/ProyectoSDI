import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-store-confirm',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-product-store-confirm.component.html',
  styleUrl: './delete-product-store-confirm.component.scss'
})
export class DeleteProductStoreConfirmComponent {

}
