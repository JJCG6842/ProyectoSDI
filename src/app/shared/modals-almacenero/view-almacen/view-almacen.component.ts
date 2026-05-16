import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Almacen } from '../../../interface/almacen.interface';

@Component({
  selector: 'app-view-almacen',
  imports: [MatButtonModule,MatDialogModule,CommonModule],
  templateUrl: './view-almacen.component.html',
  styleUrl: './view-almacen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAlmacenComponent {
  constructor(public dialogRef: MatDialogRef<ViewAlmacenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Almacen
  ){}

  cerrar(): void {
    this.dialogRef.close();
  }
}
