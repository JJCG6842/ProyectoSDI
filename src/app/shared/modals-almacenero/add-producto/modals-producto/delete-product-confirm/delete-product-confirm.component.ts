import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-confirm',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-product-confirm.component.html',
  styleUrl: './delete-product-confirm.component.scss'
})
export class DeleteProductConfirmComponent {

}
