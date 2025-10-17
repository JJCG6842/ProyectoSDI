import { Component,inject,ChangeDetectionStrategy, } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-categoria-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-categoria-success.component.html',
  styleUrl: './delete-categoria-success.component.scss'
})
export class DeleteCategoriaSuccessComponent {

}
