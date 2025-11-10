import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-entrada-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-entrada-success.component.html',
  styleUrl: './delete-entrada-success.component.scss'
})
export class DeleteEntradaSuccessComponent {

}
