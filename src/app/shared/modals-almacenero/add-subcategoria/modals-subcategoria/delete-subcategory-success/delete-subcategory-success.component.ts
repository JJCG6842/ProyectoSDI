import { Component , ChangeDetectionStrategy} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-subcategory-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-subcategory-success.component.html',
  styleUrl: './delete-subcategory-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteSubcategorySuccessComponent {

}
