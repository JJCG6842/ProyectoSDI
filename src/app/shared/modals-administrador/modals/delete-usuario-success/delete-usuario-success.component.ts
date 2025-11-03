import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-usuario-success',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-usuario-success.component.html',
  styleUrl: './delete-usuario-success.component.scss'
})
export class DeleteUsuarioSuccessComponent {

}
