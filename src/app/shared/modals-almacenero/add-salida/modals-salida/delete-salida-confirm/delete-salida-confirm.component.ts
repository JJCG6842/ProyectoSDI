import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-salida-confirm',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-salida-confirm.component.html',
  styleUrl: './delete-salida-confirm.component.scss'
})
export class DeleteSalidaConfirmComponent {

}
