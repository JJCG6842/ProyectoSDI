import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { AlmacenesService } from '../../../services/almacen.service';
import { AddProductStoreConfirmComponent } from '../add-product-store-confirm/add-product-store-confirm.component';
import { MatButtonModule } from '@angular/material/button';
import { AddProductStoreSuccessComponent } from '../add-product-store-success/add-product-store-success.component';

@Component({
  selector: 'app-add-product-store',
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-product-store.component.html',
  styleUrl: './add-product-store.component.scss'
})
export class AddProductStoreComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  readonly reload = inject(ChangeDetectorRef);
  readonly productoService = inject(ProductoService);
  readonly almacenesService = inject(AlmacenesService);
  readonly dialogRef = inject(MatDialogRef<AddProductStoreComponent>); 

  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  storeId!: string; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.storeId = this.data?.storeId;
    if (!this.storeId) {
      console.error('⚠️ storeId no recibido en AddProductStoreComponent');
    }
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => console.error('Error al cargar productos', err),
    });
  }

  search() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.cargarProductos();
      return;
    }

    this.isloading = true;

    this.productoService.buscarProducto(term).subscribe({
      next: (res) => {
        this.productos = res;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error en la búsqueda', err);
        this.productos = [];
        this.isloading = false;
        this.reload.markForCheck();
      },
    });
  }

  add(producto: Producto) {
  const confirmDialog = this.dialog.open(AddProductStoreConfirmComponent, {
    width: '400px',
    disableClose: true,
  });

  confirmDialog.afterClosed().subscribe((confirmado) => {
    if (confirmado) {
      
      this.almacenesService.agregarProductoAAlmacen(this.storeId, producto.id).subscribe({
        next: (productoActualizado) => {
          this.dialog.open(AddProductStoreSuccessComponent);
          this.dialogRef.close(productoActualizado);
        },
        error: (err) => {
          console.error('Error al registrar producto en el almacén:', err);
        },
      });
    }
  });
  }
}