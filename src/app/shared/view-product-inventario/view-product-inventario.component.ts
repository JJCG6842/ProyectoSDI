import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interface/producto.interface';

@Component({
  selector: 'app-view-product-inventario',
  imports: [MatButtonModule,MatDialogModule,CommonModule],
  templateUrl: './view-product-inventario.component.html',
  styleUrl: './view-product-inventario.component.scss'
})
export class ViewProductInventarioComponent {
constructor(public dialogRef: MatDialogRef<ViewProductInventarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ){}

  cerrar(): void {
    this.dialogRef.close();
  }
}
