import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-marca-confirm',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-marca-confirm.component.html',
  styleUrl: './delete-marca-confirm.component.scss'
})
export class DeleteMarcaConfirmComponent {

}
