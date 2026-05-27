import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-guia-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './create-guia-success.component.html',
  styleUrl: './create-guia-success.component.scss'
})
export class CreateGuiaSuccessComponent {

}
