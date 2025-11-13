import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-cliente-confirm',
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-cliente-confirm.component.html',
  styleUrl: './delete-cliente-confirm.component.scss'
})
export class DeleteClienteConfirmComponent {

}
