import { Component,ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../interface/proveedor.interface';

@Component({
  selector: 'app-view-supplier',
  imports: [MatButtonModule,MatDialogModule,CommonModule],
  templateUrl: './view-supplier.component.html',
  styleUrl: './view-supplier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSupplierComponent {
constructor(public dialogRef: MatDialogRef<ViewSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor
  ){}

  cerrar(): void {
    this.dialogRef.close();
  }
}
