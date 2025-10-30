import { Component,inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule , MatDialog} from '@angular/material/dialog';
import { AddAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/add-almacen.component';
import { EditAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/option-almacen/edit-almacen/edit-almacen.component';
import { DeleteAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/option-almacen/delete-almacen/delete-almacen.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-almacen-almacenero',
  imports: [MatIconModule, MatDialogModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-almacenero.component.html',
  styleUrl: './almacen-almacenero.component.scss'
})
export class AlmacenAlmaceneroComponent {
  readonly dialog = inject(MatDialog);

  constructor(private router: Router,){}

  addAlmacen(){
      const dialogRef = this.dialog.open(AddAlmacenComponent, {
        width: '80%',
        panelClass:'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editAlmacen(){
      const dialogRef = this.dialog.open(EditAlmacenComponent, {
        width: '80%',
        panelClass:'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteAlmacen(){
      const dialogRef = this.dialog.open(DeleteAlmacenComponent, {
        width: '80%',
        panelClass:'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  almacen(){
    this.router.navigate(['/almacenero/almacenes-section-almacenero'])
  }
}
