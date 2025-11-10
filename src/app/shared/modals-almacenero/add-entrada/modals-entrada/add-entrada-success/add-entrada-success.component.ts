import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-entrada-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './add-entrada-success.component.html',
  styleUrl: './add-entrada-success.component.scss'
})
export class AddEntradaSuccessComponent {

}
