import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-success',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user-success.component.html',
  styleUrl: './edit-user-success.component.scss'
})
export class EditUserSuccessComponent {

}
