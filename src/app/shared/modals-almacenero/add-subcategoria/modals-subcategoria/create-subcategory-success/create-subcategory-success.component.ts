import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-subcategory-success',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './create-subcategory-success.component.html',
  styleUrl: './create-subcategory-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSubcategorySuccessComponent {

}
