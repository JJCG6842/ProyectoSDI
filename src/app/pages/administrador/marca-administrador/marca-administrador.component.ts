import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Marca } from '../../../interface/marca.interface';
import { MarcaService } from '../../../services/marca.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';

@Component({
  selector: 'app-marca-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormFieldModule,MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marca-administrador.component.html',
  styleUrl: './marca-administrador.component.scss'
})
export class MarcaAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  marcaFiltrada: Marca[] = [];
  marcas: Marca[] = [];
  selectCategoryId: string = '';
  categorias: Categoria[] = [];
  isloading = false;
  searchTerm: string = '';

  constructor(private router: Router, private marcaService: MarcaService, private categoriaService: CategoriaService ){}

  ngOnInit(): void {
      this.obtenerMarca();
      this.cargarCategorias();
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

  obtenerMarca(){
    this.marcaService.getMarcas().subscribe({
      next: (obtener) =>{
        this.marcas = obtener;
        this.marcaFiltrada = obtener;
        this.isloading = false;
        console.log('Marcas obtenidas: ', this.marcas);
        this.cd.markForCheck()
      },
      error: (fail) =>{
        console.error('Error al obtener marcas:', fail);
        this.isloading = false;
      }
    });
  }

  filtrarPorCategoria(){
    if(!this.selectCategoryId){
      this.marcaFiltrada = this.marcas;
    } else {
      this.marcaFiltrada = this.marcas.filter(
        s => s.category.id === this.selectCategoryId
      );
    }
    this.cd.markForCheck();
  }


onSearchTermChange(term: string) {
  this.searchTerm = term.trim();

  if (!this.searchTerm) {
    this.obtenerMarca();
  }
}

search(){
  const term = this.searchTerm.trim();

  if(!term) return;

  this.isloading = true;

  this.marcaService.buscarMarcaPorNombre(term).subscribe({
    next: (res) => {
      this.marcas = res;
      this.isloading = false;
      this.filtrarPorCategoria(); 
      this.cd.markForCheck();
    },
    error: (err) =>{
      console.error('Error en la búsqueda :/', err);
      this.marcas = [];
      this.isloading = false;
      this.cd.markForCheck();
    }
  })
}

page1(){
  this.router.navigate(['/administrador/categoria-administrador'])
}

}
