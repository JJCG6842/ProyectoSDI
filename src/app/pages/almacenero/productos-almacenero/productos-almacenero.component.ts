import { Component , inject, ChangeDetectionStrategy,OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddProductoComponent } from '../../../shared/modals-almacenero/add-producto/add-producto.component';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { DeleteProductConfirmComponent } from '../../../shared/modals-almacenero/add-producto/modals-producto/delete-product-confirm/delete-product-confirm.component';
import { DeleteProductSuccessComponent } from '../../../shared/modals-almacenero/add-producto/modals-producto/delete-product-success/delete-product-success.component';
import { EditProductComponent } from '../../../shared/modals-almacenero/add-producto/edit-product/edit-product.component';
import { ViewProductComponent } from '../../../shared/modals-almacenero/add-producto/view-product/view-product.component';

@Component({
  selector: 'app-productos-almacenero',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule, CommonModule,FormsModule],
  templateUrl: './productos-almacenero.component.html',
  styleUrl: './productos-almacenero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosAlmaceneroComponent implements OnInit{

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

  addProduct(){
    const dialogRef = this.dialog.open(AddProductoComponent,{
      width: '650px',
      maxWidth: 'none',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.cargarProductos();
      }
    })
  }

  editProduct(producto : Producto){
    const dialogRef = this.dialog.open(EditProductComponent, {
          width: '650px',
          maxWidth: 'none',
          panelClass:'custom-dialog-container',
          data: producto
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result === true){
        this.cargarProductos();
      }
    })
  }

  eliminarProducto(id: string){
    const dialogRef = this.dialog.open(DeleteProductConfirmComponent,{
          width: '400px',
          disableClose:true,
      });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if(confirmado){
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            this.dialog.open(DeleteProductSuccessComponent,{
                width: '400px',
                disableClose: true,
              });

              this.cargarProductos();
          },
          error: (err) => {
            console.error('error al eliminar el producto', err);
          },
        })
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

    const esPartnumber = /^[A-Za-z0-9\-]+$/.test(term);

    const observable = esPartnumber
      ? this.productoService.buscarPorPartnumber(term)
      : this.productoService.buscarPorNombre(term);

    observable.subscribe({
      next: (productos) => {
        this.productos = productos;
        this.isloading = false;
        this.reload.markForCheck();
    },
    error: (err) => {
      console.error('Error al buscar productos:', err);
      this.isloading = false;
      this.productos = [];
    },
  });

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
    })

  }

  
}
