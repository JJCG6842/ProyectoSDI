import { Component , inject, ChangeDetectionStrategy,OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { ViewProductComponent } from '../../../shared/modals-almacenero/add-producto/view-product/view-product.component';

@Component({
  selector: 'app-productos-administrador',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule, CommonModule,FormsModule],
  templateUrl: './productos-administrador.component.html',
  styleUrl: './productos-administrador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly reload = inject(ChangeDetectorRef);
  readonly productoService = inject(ProductoService);
  isloading = false;
  searchTerm: string = '';

  productos: Producto[] = [];

  ngOnInit(): void {
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

  search(){
    const term = this.searchTerm.trim();

    if(!term){
      this.cargarProductos();
      return;
    }

    this.isloading = true;

    this.productoService.buscarProducto(term).subscribe({
      next: (res)=>{
        this.productos = res;
        this.isloading = false;
        this.reload.markForCheck();
      },

      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.productos = [];
        this.isloading = false;
        this.reload.markForCheck();
      }
    })
  }

  view(producto: Producto){
    const dialogRef = this.dialog.open(ViewProductComponent,{
      width: '600px',
      maxWidth: 'none',
      panelClass:'custom-dialog-container',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
