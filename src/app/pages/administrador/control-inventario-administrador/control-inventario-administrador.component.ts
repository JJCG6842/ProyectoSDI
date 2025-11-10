import { Component ,inject, ChangeDetectionStrategy,OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { Categoria } from '../../../interface/categoria.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriaService } from '../../../services/categoria.service';
import { Marca } from '../../../interface/marca.interface';
import { MatSelectModule } from '@angular/material/select';
import { MarcaService } from '../../../services/marca.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-inventario',
  imports: [MatIconModule, MatExpansionModule, MatDialogModule, CommonModule,FormsModule,MatFormFieldModule,
    MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './control-inventario-administrador.component.html',
  styleUrl: './control-inventario-administrador.component.scss'
})
export class ControlInventarioAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  selectCategoryId: string = '';
  selectMarcaId: string = '';
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  marcas: Marca[] = [];

  constructor(private router: Router,private categoriaService: CategoriaService, private marcaService: MarcaService,
    private productoService: ProductoService
  ){}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarca();
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

  filtrarPorCategoria() {
  if (!this.selectCategoryId) {
    this.cargarProductos(); 
    return;
  }

  this.productoService.buscarPorCategoriaId(this.selectCategoryId).subscribe({
    next: (res) => {
      this.productos = res;
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

  entradas(){
    this.router.navigate(['/administrador/entrada-administrador'])
  }

  salidas(){
    this.router.navigate(['/administrador/salida-administrador'])
  }
}
