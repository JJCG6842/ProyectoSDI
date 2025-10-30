import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subcategoria } from '../../../interface/subcategoria.interface';
import { SubcategoriaService } from '../../../services/subcategoria.service';

@Component({
  selector: 'app-subcategoria-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcategoria-administrador.component.html',
  styleUrl: './subcategoria-administrador.component.scss'
})
export class SubcategoriaAdministradorComponent {
  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  subcategorias: Subcategoria[] = [];
  isloading = false;
  searchTerm: string = '';

  constructor(private router: Router, private subcategoriaService : SubcategoriaService ){}

  ngOnInit(): void {
      this.obtenerSubcategoria();
  }
  

  obtenerSubcategoria(){
    this.subcategoriaService.getSubcategoria().subscribe({
      next: (obtener) =>{
        this.subcategorias = obtener;
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

  search(){
    const term = this.searchTerm.trim();

    if(!term){
      this.obtenerSubcategoria();
      return;
    }

    this.isloading = true;

    this.subcategoriaService.buscarSubcategoria(term).subscribe({
      next: (res) => {
        this.subcategorias = res;
        this.isloading = false;
        this.cd.markForCheck();
      },

      error: (err) => {
        console.error('Error en la busqueda :/', err);
        this.subcategorias = [];
        this.isloading = false;
        this.cd.markForCheck();
      }
    })
  }


  page1(){
    this.router.navigate(['/administrador/categoria-administrador'])
  }
  
}
