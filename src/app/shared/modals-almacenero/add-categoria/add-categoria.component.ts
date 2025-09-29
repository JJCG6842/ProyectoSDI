import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-add-categoria',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './add-categoria.component.html',
  styleUrl: './add-categoria.component.scss'
})
export class AddCategoriaComponent {

}
