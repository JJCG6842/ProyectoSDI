import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProductoComponent } from '../../../shared/modals-almacenero/add-producto/add-producto.component';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { DeleteProductConfirmComponent } from '../../../shared/modals-almacenero/add-producto/modals-producto/delete-product-confirm/delete-product-confirm.component';
import { DeleteProductSuccessComponent } from '../../../shared/modals-almacenero/add-producto/modals-producto/delete-product-success/delete-product-success.component';
import { EditProductComponent } from '../../../shared/modals-almacenero/add-producto/edit-product/edit-product.component';
import { ViewProductComponent } from '../../../shared/modals-almacenero/add-producto/view-product/view-product.component';
import { Categoria } from '../../../interface/categoria.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriaService } from '../../../services/categoria.service';
import { Marca } from '../../../interface/marca.interface';
import { MatSelectModule } from '@angular/material/select';
import { MarcaService } from '../../../services/marca.service';

@Component({
  selector: 'app-productos-almacenero',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule,
    MatSelectModule, MatPaginatorModule],
  templateUrl: './productos-almacenero.component.html',
  styleUrl: './productos-almacenero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosAlmaceneroComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly reload = inject(ChangeDetectorRef);
  readonly productoService = inject(ProductoService);
  isloading = false;
  searchTerm: string = '';
  selectCategoryId: string = '';
  selectMarcaId: string = '';
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  marcas: Marca[] = [];
  selectState: 'Habilitado' | 'Deshabilitado' | '' = '';

  constructor(private categoriaService: CategoriaService, private marcaService: MarcaService) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarca();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.pageSize = 8;
    }
  }

  get pagedProductos(): Producto[] {
    if (!this.paginator) return this.productos;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return this.productos.slice(startIndex, startIndex + this.paginator.pageSize);
  }


  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (products) => {
        this.productos = products;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        this.isloading = false;
        console.error('Error al cargar productos', err);
      }
    })
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
        console.log('Categorias:', res);
      },
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  cargarMarca() {
    this.marcaService.getMarcas().subscribe({
      next: (res) => {
        this.marcas = res;
        console.log('Marcas:', res);
      },
      error: (err) => console.error('Error al cargar marcas', err),
    });
  }


  addProduct() {
    const dialogRef = this.dialog.open(AddProductoComponent, {
      width: '650px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.cargarProductos();
      }
    })
  }

  editProduct(producto: Producto) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '650px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container',
      data: producto
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cargarProductos();
      }
    })
  }

  eliminarProducto(id: string) {
    const dialogRef = this.dialog.open(DeleteProductConfirmComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            this.dialog.open(DeleteProductSuccessComponent, {
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

        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.isloading = false;
        this.reload.markForCheck();
      },

      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.productos = [];

        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.isloading = false;
        this.reload.markForCheck();
      }
    })
  }

  view(producto: Producto) {
    const dialogRef = this.dialog.open(ViewProductComponent, {
      width: '600px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })

  }


  filtrarPorCategoria() {
    if (!this.selectCategoryId) {
      this.cargarProductos();
      return;
    }

    this.productoService.buscarPorCategoriaId(this.selectCategoryId).subscribe({
      next: (res) => {
        this.productos = res;
        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al filtrar por categoría', err);
        this.productos = [];
      },
    });
  }

  filtrarPorMarca() {
    if (!this.selectMarcaId) {
      this.cargarProductos();
      return;
    }

    this.productoService.buscarPorMarcaId(this.selectMarcaId).subscribe({
      next: (res) => {
        this.productos = res;
        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al filtrar por marca', err);
        this.productos = [];
      },
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();

    if (!this.searchTerm) {
      this.cargarProductos();
    }
  }

  habilitar(id: string) {
    this.productoService.habilitarProducto(id).subscribe(() => {
      this.cargarProductos();
    });
  }

  deshabilitar(id: string) {
    this.productoService.deshabilitarProducto(id).subscribe(() => {
      this.cargarProductos();
    });
  }

  filtrarPorEstado() {
    if (!this.selectState) {
      this.cargarProductos();
      return;
    }

    this.productoService.filtrarPorEstado(this.selectState).subscribe({
      next: res => {
        this.productos = res;
        if (this.paginator) this.paginator.firstPage();
        this.reload.markForCheck();
      },
      error: err => {
        console.error('Error al filtrar por estado', err);
        this.productos = [];
      }
    });
  }


}
