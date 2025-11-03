import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-store-confirm',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './add-product-store-confirm.component.html',
  styleUrl: './add-product-store-confirm.component.scss'
})
export class AddProductStoreConfirmComponent {

}
