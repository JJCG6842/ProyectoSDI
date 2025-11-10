import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-salida-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-salida-success.component.html',
  styleUrl: './delete-salida-success.component.scss'
})
export class DeleteSalidaSuccessComponent {

}
