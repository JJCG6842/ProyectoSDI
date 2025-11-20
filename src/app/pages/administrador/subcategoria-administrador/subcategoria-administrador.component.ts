import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject, ViewChild} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddSubcategoriaComponent } from '../../../shared/modals-almacenero/add-subcategoria/add-subcategoria.component';
import { Subcategoria } from '../../../interface/subcategoria.interface';
import { SubcategoriaService } from '../../../services/subcategoria.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-subcategoria-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, 
    FormsModule, MatFormFieldModule,MatSelectModule,MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcategoria-administrador.component.html',
  styleUrl: './subcategoria-administrador.component.scss'
})
export class SubcategoriaAdministradorComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  subcategoriasFiltrada: Subcategoria[] = [];
  subcategorias: Subcategoria[] = [];
  selectCategoryId: string = '';
  dataSource!: MatTableDataSource<Subcategoria>;
  categorias: Categoria[] = [];
  isloading = false;
  searchTerm: string = '';

  constructor(private router: Router, private subcategoriaService : SubcategoriaService , 
    private categoriaService: CategoriaService){}

  ngOnInit(): void {
      this.obtenerSubcategoria();
      this.cargarCategorias();   
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = 8;
    }
  }

  get pagedSubcategorias(): Subcategoria[] {
    if (!this.dataSource || !this.paginator) return [];

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();
    if (!this.searchTerm) this.obtenerSubcategoria();
  }
  
  obtenerSubcategoria(){
    this.subcategoriaService.getSubcategorias().subscribe({
      next: (obtener) =>{
        this.subcategorias = obtener;
        this.subcategoriasFiltrada = obtener;
        this.dataSource = new MatTableDataSource(this.subcategoriasFiltrada);

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 8;
          }
        });
        this.isloading = false;
        console.log('Subcategorias obtenidas: ', this.subcategorias);
        this.cd.markForCheck()
      },
      error: (fail) =>{
        console.error('Error al obtener subcategorías:', fail);
        this.isloading = false;
      }
    });
  }

  filtrarPorCategoria() {
    if (!this.selectCategoryId) {
      this.subcategoriasFiltrada = this.subcategorias;
    } else {
      this.subcategoriasFiltrada = this.subcategorias.filter(s => s.category.id === this.selectCategoryId);
    }

    this.dataSource = new MatTableDataSource(this.subcategoriasFiltrada);
    this.paginator.firstPage();
    this.dataSource.paginator = this.paginator;

    this.cd.markForCheck();
  }

  search() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.obtenerSubcategoria();
      return;
    }

    this.subcategoriaService.buscarSubcategoria(term).subscribe({
      next: (res) => {
        this.subcategorias = res;
        this.filtrarPorCategoria();

        this.dataSource = new MatTableDataSource(this.subcategoriasFiltrada);
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 8;

        this.cd.markForCheck();
      },
      error: () => {
        this.subcategorias = [];
        this.subcategoriasFiltrada = [];
        //this.dataSource = new MatTableDataSource([]);

        this.cd.markForCheck();
      }
    });
  }

  page1(){
    this.router.navigate(['/administrador/categoria-administrador'])
  }
}
