import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddSupplierComponent } from '../../../shared/modals-administrador/add-supplier/add-supplier.component';
import { EditSupplierComponent } from '../../../shared/modals-administrador/edit-supplier/edit-supplier.component';
import { DeleteSupplierConfirmComponent } from '../../../shared/modals-administrador/delete-supplier/delete-supplier-confirm/delete-supplier-confirm.component';

@Component({
  selector: 'app-proveedores-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedores-administrador.component.html',
  styleUrl: './proveedores-administrador.component.scss'
})
export class ProveedoresAdministradorComponent {

readonly dialog = inject(MatDialog);


  createSupplier(){
    const dialogRef = this.dialog.open(AddSupplierComponent, {
          width: '70%',
          panelClass:'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
  }

  editSupplier(){
    const dialogRef = this.dialog.open(EditSupplierComponent, {
          width: '70%',
          panelClass:'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
  }

  deleteSupplier(){
    const dialogRef = this.dialog.open(DeleteSupplierConfirmComponent, {
          width: '70%',
          panelClass:'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
  }
  
}
