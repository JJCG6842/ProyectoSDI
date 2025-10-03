import { Component , inject, ChangeDetectionStrategy} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddProductoComponent } from '../../../shared/modals-almacenero/add-producto/add-producto.component';

@Component({
  selector: 'app-productos-almacenero',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule],
  templateUrl: './productos-almacenero.component.html',
  styleUrl: './productos-almacenero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosAlmaceneroComponent {
  isExpanded = false;

  togglePanel(): void {
    this.isExpanded = !this.isExpanded;
  }

  readonly dialog = inject(MatDialog);

  addProduct(){
    const dialogRef = this.dialog.open(AddProductoComponent,{
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }
}
