import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-product-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './create-product-success.component.html',
  styleUrl: './create-product-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProductSuccessComponent {

}
