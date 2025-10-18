import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import { AddCategoriaComponent } from '../../../shared/modals-almacenero/add-categoria/add-categoria.component';
import { EditCategoriaComponent } from '../../../shared/modals-almacenero/option-categoria/edit-categoria/edit-categoria.component';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
import { DeleteCategoriaConfirmComponent } from '../../../shared/modals-almacenero/option-categoria/delete/delete-categoria-confirm/delete-categoria-confirm.component';
import { DeleteCategoriaSuccessComponent } from '../../../shared/modals-almacenero/option-categoria/delete/delete-categoria-success/delete-categoria-success.component';

@Component({
  selector: 'app-categoria-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categoria-almacenero.component.html',
  styleUrl: './categoria-almacenero.component.scss'
})
export class CategoriaAlmaceneroComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  categorias: Categoria[] = [];
  isLoading = false;
  searchTerm: string = '';

  constructor(private router: Router, private categoriaService: CategoriaService){}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  addCategory(){
    const dialogRef = this.dialog.open(AddCategoriaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.obtenerCategorias();
      }
    });
  } 

  obtenerCategorias(){
    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
        this.isLoading = false;
        console.log('Categorías cargadas:', this.categorias);
        this.cd.markForCheck()
      },
      error: (err) => {
      console.error('Error al obtener categorías:', err);
      this.isLoading = false;
    },
    });
  }

  editCategory(categoria: Categoria){
    const dialogRef = this.dialog.open(EditCategoriaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container',
      data: categoria
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.obtenerCategorias();
      }
    })
  }

  deleteCategoria(id: string){
    const dialogRef = this.dialog.open(DeleteCategoriaConfirmComponent,{
      width: '400px',
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if(confirmado){
        this.categoriaService.eliminarCategoriaporId(id).subscribe({
          next: () => {
            this.dialog.open(DeleteCategoriaSuccessComponent,{
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

  search(){
    const term = this.searchTerm.trim();

    if(!term){
      this.obtenerCategorias();
      return;
    }

    this.isLoading = true;

    this.categoriaService.buscarCategoria(term).subscribe({
      next: (res) => {
        this.categorias = res;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.categorias = [];
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  //solo un filtado automatico :/
  onSearchChange(){
    const term = this.searchTerm.trim();

    if(!term){
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

  page2(){
    this.router.navigate(['/almacenero/subcategoria'])
  }
}
