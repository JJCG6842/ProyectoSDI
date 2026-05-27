import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-guia-confirm',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-guia-confirm.component.html',
  styleUrl: './delete-guia-confirm.component.scss'
})
export class DeleteGuiaConfirmComponent {

}
