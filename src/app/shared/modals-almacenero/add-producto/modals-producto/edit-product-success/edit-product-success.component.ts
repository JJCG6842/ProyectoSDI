import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-product-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './edit-product-success.component.html',
  styleUrl: './edit-product-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProductSuccessComponent {

}
