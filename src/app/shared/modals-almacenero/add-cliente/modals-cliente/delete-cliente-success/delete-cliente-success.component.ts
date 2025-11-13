import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-cliente-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-cliente-success.component.html',
  styleUrl: './delete-cliente-success.component.scss'
})
export class DeleteClienteSuccessComponent {

}
