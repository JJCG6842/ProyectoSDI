import { Component,inject,ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-supplier-success',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-supplier-success.component.html',
  styleUrl: './delete-supplier-success.component.scss'
})
export class DeleteSupplierSuccessComponent {

}
