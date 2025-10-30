import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddProductStoreComponent } from '../../../shared/modals-almacenero/add-product-store/add-product-store.component';

@Component({
  selector: 'app-almacen-2-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule,MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-2-almacenero.component.html',
  styleUrl: './almacen-2-almacenero.component.scss'
})
export class Almacen2AlmaceneroComponent {

  readonly dialog = inject(MatDialog);

  constructor(private router: Router){}

  addProduct(){
    const dialogRef = this.dialog.open(AddProductStoreComponent, {
          width: '70%',
          panelClass:'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
  }


  almacen1(){
    this.router.navigate(['/almacenero/almacenes-almacenero'])
  }

}
