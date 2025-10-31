import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-success',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-user-success.component.html',
  styleUrl: './create-user-success.component.scss'
})
export class CreateUserSuccessComponent {

}
