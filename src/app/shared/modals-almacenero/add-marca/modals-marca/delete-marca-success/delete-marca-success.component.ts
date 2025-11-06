import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-marca-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-marca-success.component.html',
  styleUrl: './delete-marca-success.component.scss'
})
export class DeleteMarcaSuccessComponent {

}
