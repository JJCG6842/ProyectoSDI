import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-supplier-success',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-supplier-success.component.html',
  styleUrl: './create-supplier-success.component.scss'
})
export class CreateSupplierSuccessComponent {

}
