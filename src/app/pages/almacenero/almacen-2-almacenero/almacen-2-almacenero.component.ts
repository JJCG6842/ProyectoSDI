import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddProductStoreComponent } from '../../../shared/modals-almacenero/add-product-store/add-product-store.component';
import { AlmacenesService } from '../../../services/almacen.service';
import { Producto } from '../../../interface/producto.interface';
import { DeleteProductStoreConfirmComponent } from '../../../shared/modals-almacenero/delete-product-store/delete-product-store-confirm/delete-product-store-confirm.component';
import { DeleteProductStoreSuccessComponent } from '../../../shared/modals-almacenero/delete-product-store/delete-product-store-success/delete-product-store-success.component';

@Component({
  selector: 'app-almacen-2-almacenero',
  imports: [MatIconModule,MatDialogModule,MatButtonModule,CommonModule,FormsModule,MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-2-almacenero.component.html',
  styleUrl: './almacen-2-almacenero.component.scss'
})
export class Almacen2AlmaceneroComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  productos: Producto[] = [];
  currentStoreId!: string; 
  searchTerm: string = ''; 
  storeName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private almacenesService: AlmacenesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.currentStoreId = this.route.snapshot.paramMap.get('id')!;
    if (this.currentStoreId) {
      this.cargarProductosDelAlmacen();
    }
  }

  cargarProductosDelAlmacen() {
    this.almacenesService.obtenerProductosPorAlmacen(this.currentStoreId).subscribe({
      next: (almacen) => {
        this.productos = almacen.products || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar productos del almacén', err),
    });
  }



  addProduct() {
    const dialogRef = this.dialog.open(AddProductStoreComponent, {
      width: '1300px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container',
      data: { storeId: this.currentStoreId }
    });

    dialogRef.afterClosed().subscribe((productoAgregado) => {
      if (productoAgregado) {
        this.cargarProductosDelAlmacen();
      }
    });
  }

  eraseProduct(productoId: string) {
  const dialogRef = this.dialog.open(DeleteProductStoreConfirmComponent, {
    width: '400px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((confirmado) => {
    if (confirmado) {
      this.almacenesService.removerProductoDeAlmacen(productoId).subscribe({
        next: (res) => {
          this.dialog.open(DeleteProductStoreSuccessComponent, {
            width: '400px',
            data: { producto: res }
          });
          this.cargarProductosDelAlmacen(); 
        },
        error: (err) => console.error('Error al remover producto del almacén:', err)
      });
    }
  });
}

searchProduct() {
  const term = this.searchTerm.trim();
  if (!term) {
    this.cargarProductosDelAlmacen();
    return;
  }

  this.almacenesService.buscarProductoPorNombreEnAlmacen(this.currentStoreId, term)
    .subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.productos = [];
        this.cdr.markForCheck();
      }
    });
}
  
  almacen1() {
    this.router.navigate(['/almacenero/almacenes-almacenero']);
  }
}
