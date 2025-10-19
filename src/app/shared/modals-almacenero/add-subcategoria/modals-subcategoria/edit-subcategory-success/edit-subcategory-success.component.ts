import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-subcategory-success',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './edit-subcategory-success.component.html',
  styleUrl: './edit-subcategory-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSubcategorySuccessComponent {

}
