import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-erase-entrada-confirm',
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './erase-entrada-confirm.component.html',
  styleUrl: './erase-entrada-confirm.component.scss'
})
export class EraseEntradaConfirmComponent {

}
