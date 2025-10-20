import { Component , inject, ChangeDetectionStrategy,OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddProductoComponent } from '../../../shared/modals-almacenero/add-producto/add-producto.component';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';

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

  productos: Producto[] = [];

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(){
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        this.reload.markForCheck();
      },
      error: (err) => {
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
      console.log(`Dialog result: ${result}`)
    })
  }
}
