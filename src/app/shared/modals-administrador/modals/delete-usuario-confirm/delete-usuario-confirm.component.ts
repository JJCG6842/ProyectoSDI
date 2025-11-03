import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-usuario-confirm',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-usuario-confirm.component.html',
  styleUrl: './delete-usuario-confirm.component.scss'
})
export class DeleteUsuarioConfirmComponent {

}
