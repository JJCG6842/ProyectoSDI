import { Component, ChangeDetectionStrategy, inject,ChangeDetectorRef, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SalidaService } from '../../../services/salida.service';
import { FormsModule } from '@angular/forms';
import { Salida } from '../../../interface/salida.interface';
import { AddSalidaComponent } from '../../../shared/modals-almacenero/add-salida/add-salida.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DeleteSalidaConfirmComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/delete-salida-confirm/delete-salida-confirm.component';
import { Producto } from '../../../interface/producto.interface';
import { DeleteSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/delete-salida-success/delete-salida-success.component';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salidas-almacenero',
  imports: [MatExpansionModule,MatIconModule,MatDialogModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-almacenero.component.html',
  styleUrl: './salidas-almacenero.component.scss'
})
export class SalidasAlmaceneroComponent implements OnInit{

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  salidas: Salida[] =[];

  constructor(private router: Router,private productoService: ProductoService, 
    private salidaService: SalidaService ){}

    ngOnInit(): void {
      this.cargarSalidas();
      this.cargarProductos();
  }

  cargarProductos(){
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        this.isloading = false;
        console.error('Error al cargar productos', err);
      }
    })
  }

    cargarSalidas(){
      this.salidaService.getSalidas().subscribe({
        next: (data) => {
        this.salidas = data;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar salidas:', err);
        this.isloading = false;
      },
      })
    }

    addSalidas() {
          const dialogRef = this.dialog.open(AddSalidaComponent,{
            width: '550px',
            maxWidth: 'none',
            panelClass:'custom-dialog-container'
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result){
                this.cargarSalidas();
            }
          });
      }

      eraseSalida(id: string): void{
        const dialogRef = this.dialog.open(DeleteSalidaConfirmComponent, {
              width: '400px',
              disableClose: true,
              data: { id }
          });
        
          dialogRef.afterClosed().subscribe((confirmado) => {
            if (confirmado) {
              this.isloading = true;
              this.salidaService.deleteSalida(id).subscribe({
              next: () => {
                this.dialog.open(DeleteSalidaSuccessComponent,{
                      width: '400px',
                      disableClose: true,
                });
                this.cargarSalidas(); 
              },
              error: (error) => {
                console.error('Error al eliminar entrada:', error);
                this.isloading = false;
              },
            });
          }
        });
      }

  search() {
  const term = this.searchTerm.trim();

  if (!term) {
    this.cargarSalidas();
    return;
  }

  this.isloading = true;

  this.salidaService.buscarPorProducto(term).subscribe({
    next: (res) => {
      this.salidas = res;
      this.isloading = false;
      this.reload.markForCheck();
    },
    error: (err) => {
      console.error('Error al buscar salidas:', err);
      this.salidas = [];
      this.isloading = false;
      this.reload.markForCheck();
    },
  });
}

onSearchTermChange(term: string) {
  this.searchTerm = term.trim();
  if (!this.searchTerm) {
    this.cargarSalidas();
  } 
}

  kardex(){
    this.router.navigate(['/almacenero/panel-inventario'])
  }

  entradas(){
    this.router.navigate(['/almacenero/entrada-almacenero'])
  }
}
