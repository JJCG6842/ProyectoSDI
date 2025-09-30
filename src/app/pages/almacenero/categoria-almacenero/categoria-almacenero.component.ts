import { Component , inject, ChangeDetectionStrategy} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import { AddCategoriaComponent } from '../../../shared/modals-almacenero/add-categoria/add-categoria.component';

@Component({
  selector: 'app-categoria-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categoria-almacenero.component.html',
  styleUrl: './categoria-almacenero.component.scss'
})
export class CategoriaAlmaceneroComponent {
  readonly dialog = inject(MatDialog);

  addCategory(){
    const dialogRef = this.dialog.open(AddCategoriaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  } 
}
