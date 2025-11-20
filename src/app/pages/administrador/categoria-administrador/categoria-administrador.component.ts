import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { AddCategoriaComponent } from '../../../shared/modals-almacenero/add-categoria/add-categoria.component';
import { EditCategoriaComponent } from '../../../shared/modals-almacenero/option-categoria/edit-categoria/edit-categoria.component';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
import { DeleteCategoriaConfirmComponent } from '../../../shared/modals-almacenero/option-categoria/delete/delete-categoria-confirm/delete-categoria-confirm.component';
import { DeleteCategoriaSuccessComponent } from '../../../shared/modals-almacenero/option-categoria/delete/delete-categoria-success/delete-categoria-success.component';

@Component({
  selector: 'app-categoria-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatTableModule,
    MatInputModule, MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categoria-administrador.component.html',
  styleUrl: './categoria-administrador.component.scss'
})
export class CategoriaAdministradorComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  categorias: Categoria[] = [];
  dataSource!: MatTableDataSource<Categoria>;
  displayedColumns: string[] = ['nro', 'name', 'description', 'acciones'];
  isLoading = false;
  searchTerm: string = '';

  constructor(private router: Router, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoriaComponent, {
      width: '70%',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.obtenerCategorias();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = 8;
    }
  }

  get pagedCategorias(): Categoria[] {
    if (!this.dataSource || !this.paginator) return [];
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  obtenerCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Categoria>(this.categorias);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageSize = 8;
        }

        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
        this.isLoading = false;
      },
    });
  }

  editCategory(categoria: Categoria) {
    const dialogRef = this.dialog.open(EditCategoriaComponent, {
      width: '70%',
      panelClass: 'custom-dialog-container',
      data: categoria
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.obtenerCategorias();
      }
    })
  }

  deleteCategoria(id: string) {
    const dialogRef = this.dialog.open(DeleteCategoriaConfirmComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.categoriaService.eliminarCategoriaporId(id).subscribe({
          next: () => {
            this.dialog.open(DeleteCategoriaSuccessComponent, {
              width: '400px',
              disableClose: true,
            });

            this.obtenerCategorias();
          },
          error: (err) => {
            console.error('error al eliminar la categoria', err);
          },
        });
      }
    });
  }

  search() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.obtenerCategorias();
      return;
    }

    this.isLoading = true;

    this.categoriaService.buscarCategoria(term).subscribe({
      next: (res) => {
        this.categorias = res;
        this.dataSource = new MatTableDataSource<Categoria>(this.categorias);
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 8;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.categorias = [];
        this.dataSource = new MatTableDataSource<Categoria>([]);
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term.trim();

    if (!this.searchTerm) {
      this.obtenerCategorias();
    }
  }

  //solo un filtado automatico :/
  onSearchChange() {
    const term = this.searchTerm.trim();

    if (!term) {
      this.obtenerCategorias();
      return;
    }

    this.categoriaService.buscarCategoria(term).subscribe({
      next: (res) => {
        this.categorias = res;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('error :/', err);
        this.categorias = [];
        this.cd.markForCheck();
      },
    });
  }

  page2() {
    this.router.navigate(['/administrador/subcategoria-administrador'])
  }

  page3() {
    this.router.navigate(['/administrador/marca-administrador'])
  }
}
