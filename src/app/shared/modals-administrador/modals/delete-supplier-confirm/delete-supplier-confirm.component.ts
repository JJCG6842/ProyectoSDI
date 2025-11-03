import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-supplier-confirm',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-supplier-confirm.component.html',
  styleUrl: './delete-supplier-confirm.component.scss'
})
export class DeleteSupplierConfirmComponent {

}
