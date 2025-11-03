import { Component,inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule , MatDialog} from '@angular/material/dialog';
import { AddAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/add-almacen.component';
import { EditAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/option-almacen/edit-almacen/edit-almacen.component';
import { DeleteAlmacenComponent } from '../../../shared/modals-almacenero/add-almacen/option-almacen/delete-almacen/delete-almacen.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlmacenesService } from '../../../services/almacen.service';
import { Almacen } from '../../../interface/almacen.interface';


@Component({
  selector: 'app-almacen-almacenero',
  imports: [MatIconModule, MatDialogModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-almacenero.component.html',
  styleUrl: './almacen-almacenero.component.scss'
})
export class AlmacenAlmaceneroComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  almacenes: Almacen[] = [];

  constructor(private router: Router,private almacenesService: AlmacenesService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
      this.cargarAlmacenes();
  }

  cargarAlmacenes(){
    this.almacenesService.obtenerAlmacenes().subscribe({
      next:(data) => {
        this.almacenes = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar almacenes', err)
    });
  }

  addAlmacen(){
      const dialogRef = this.dialog.open(AddAlmacenComponent, {
        width: '80%',
        panelClass:'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        this.cargarAlmacenes();
      }
    });
  }

  editAlmacen() {
  const dialogRef = this.dialog.open(EditAlmacenComponent, {
    width: '60%',
    panelClass: 'custom-dialog-container',
  });

  dialogRef.afterClosed().subscribe((updatedAlmacen) => {
    if (updatedAlmacen) {
      const index = this.almacenes.findIndex(a => a.id === updatedAlmacen.id);
      if (index !== -1) {
        this.almacenes[index].name = updatedAlmacen.name;
      }
      if(updatedAlmacen === true){
        this.cargarAlmacenes();
      }
    }
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

  verAlmacen(almacen: Almacen){
    this.router.navigate(['/almacenero/almacenes-section-almacenero', almacen.id]);
  }
}
