import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-almacen-success',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-almacen-success.component.html',
  styleUrl: './edit-almacen-success.component.scss'
})
export class EditAlmacenSuccessComponent {

}
