import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-guia-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-guia-success.component.html',
  styleUrl: './delete-guia-success.component.scss'
})
export class DeleteGuiaSuccessComponent {

}
