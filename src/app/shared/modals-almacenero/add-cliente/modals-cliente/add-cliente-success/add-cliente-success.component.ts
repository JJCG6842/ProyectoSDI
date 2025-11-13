import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-cliente-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './add-cliente-success.component.html',
  styleUrl: './add-cliente-success.component.scss'
})
export class AddClienteSuccessComponent {

}
