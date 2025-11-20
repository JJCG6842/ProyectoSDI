import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { ViewProductComponent } from '../../../shared/modals-almacenero/add-producto/view-product/view-product.component';
import { Categoria } from '../../../interface/categoria.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriaService } from '../../../services/categoria.service';
import { Marca } from '../../../interface/marca.interface';
import { MatSelectModule } from '@angular/material/select';
import { MarcaService } from '../../../services/marca.service';

@Component({
  selector: 'app-productos-administrador',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule, CommonModule, FormsModule, MatFormFieldModule,
    MatSelectModule, MatPaginatorModule],
  templateUrl: './productos-administrador.component.html',
  styleUrl: './productos-administrador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosAdministradorComponent implements OnInit {

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


}
