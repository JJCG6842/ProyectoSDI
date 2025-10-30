import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-delete-almacen-confirm',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-almacen-confirm.component.html',
  styleUrl: './delete-almacen-confirm.component.scss'
})
export class DeleteAlmacenConfirmComponent {

}
