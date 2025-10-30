import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';

@Component({
  selector: 'app-categoria-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categoria-administrador.component.html',
  styleUrl: './categoria-administrador.component.scss'
})
export class CategoriaAdministradorComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  categorias: Categoria[] = [];
  isLoading = false;
  searchTerm: string = '';

  constructor(private router: Router, private categoriaService: CategoriaService){}

  ngOnInit(): void {
    this.obtenerCategorias();
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

  page2(){
    this.router.navigate(['/administrador/subcategoria-administrador'])
  }
}
