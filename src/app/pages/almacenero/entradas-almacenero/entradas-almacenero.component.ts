import { Component, ChangeDetectionStrategy,inject,ChangeDetectorRef, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EntradaService } from '../../../services/entrada.service';
import { Entrada } from '../../../interface/entrada.interface';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { EraseEntradaConfirmComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/erase-entrada-confirm/erase-entrada-confirm.component';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { DeleteEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/delete-entrada-success/delete-entrada-success.component';

@Component({
  selector: 'app-entradas-almacenero',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule,CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entradas-almacenero.component.html',
  styleUrl: './entradas-almacenero.component.scss'
})
export class EntradasAlmaceneroComponent implements OnInit{

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  entradas: Entrada[] = [];

  constructor(private router: Router, private productoService: ProductoService, private entradaService:EntradaService){}

  ngOnInit(): void {
      this.cargarEntradas();
  }

  cargarEntradas() {
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.entradas = data;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar entradas:', err);
        this.isloading = false;
      },
    });
  }

  addEntrance() {
      const dialogRef = this.dialog.open(AddEntradaComponent,{
        width: '550px',
        maxWidth: 'none',
        panelClass:'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.cargarEntradas();
        }
      });
  }

  eraseEntrada(id: string): void {
    const dialogRef = this.dialog.open(EraseEntradaConfirmComponent, {
      width: '400px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.isloading = true;
        this.entradaService.eliminarEntrada(id).subscribe({
          next: () => {
            this.dialog.open(DeleteEntradaSuccessComponent,{
                      width: '400px',
                      disableClose: true,
            });
            this.cargarEntradas(); 
          },
          error: (error) => {
            console.error('Error al eliminar entrada:', error);
            this.isloading = false;
          },
        });
      }
    });
  }


  kardex(){
    this.router.navigate(['/almacenero/panel-inventario'])
  }

  salidas(){
    this.router.navigate(['/almacenero/salida-almacenero'])
  }
}
