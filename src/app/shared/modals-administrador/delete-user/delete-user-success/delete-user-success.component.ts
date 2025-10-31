import { Component,inject,ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-user-success',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-user-success.component.html',
  styleUrl: './delete-user-success.component.scss'
})
export class DeleteUserSuccessComponent {

}
