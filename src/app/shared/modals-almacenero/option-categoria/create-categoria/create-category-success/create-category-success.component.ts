import { Component,inject,ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-category-success',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './create-category-success.component.html',
  styleUrl: './create-category-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCategorySuccessComponent {

}
