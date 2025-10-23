import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../interface/producto.interface';

@Component({
  selector: 'app-view-product',
  imports: [MatButtonModule,MatDialogModule,CommonModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProductComponent {
  constructor(public dialogRef: MatDialogRef<ViewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ){}

  cerrar(): void {
    this.dialogRef.close();
  }
}
