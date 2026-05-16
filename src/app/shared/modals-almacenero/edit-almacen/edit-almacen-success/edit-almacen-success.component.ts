import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-almacen-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './edit-almacen-success.component.html',
  styleUrl: './edit-almacen-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAlmacenSuccessComponent {

}
