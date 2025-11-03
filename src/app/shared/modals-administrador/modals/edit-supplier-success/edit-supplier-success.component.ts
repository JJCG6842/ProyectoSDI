import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-supplier-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './edit-supplier-success.component.html',
  styleUrl: './edit-supplier-success.component.scss'
})
export class EditSupplierSuccessComponent {

}
