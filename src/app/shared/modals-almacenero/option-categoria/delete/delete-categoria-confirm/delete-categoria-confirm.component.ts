import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-categoria-confirm',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-categoria-confirm.component.html',
  styleUrl: './delete-categoria-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteCategoriaConfirmComponent {

}
