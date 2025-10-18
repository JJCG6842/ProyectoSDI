import { Component,inject,ChangeDetectionStrategy, } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-category-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './edit-category-success.component.html',
  styleUrl: './edit-category-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategorySuccessComponent {

}
