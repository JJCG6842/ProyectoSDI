import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-subcategory-confirm',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-subcategory-confirm.component.html',
  styleUrl: './delete-subcategory-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteSubcategoryConfirmComponent {

}
