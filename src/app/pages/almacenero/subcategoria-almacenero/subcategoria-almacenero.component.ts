import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
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
import { EditCategoriaComponent } from '../../../shared/modals-almacenero/option-categoria/edit-categoria/edit-categoria.component';
import { EditSubcategoryComponent } from '../../../shared/modals-almacenero/add-subcategoria/option-subcategoria/edit-subcategory/edit-subcategory.component';
import { DeleteSubcategorySuccessComponent } from '../../../shared/modals-almacenero/add-subcategoria/modals-subcategoria/delete-subcategory-success/delete-subcategory-success.component';
import { DeleteSubcategoryConfirmComponent } from '../../../shared/modals-almacenero/add-subcategoria/modals-subcategoria/delete-subcategory-confirm/delete-subcategory-confirm.component';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';

@Component({
  selector: 'app-subcategoria-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormFieldModule,MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcategoria-almacenero.component.html',
  styleUrl: './subcategoria-almacenero.component.scss'
})
export class SubcategoriaAlmaceneroComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  subcategoriasFiltrada: Subcategoria[] = [];
  subcategorias: Subcategoria[] = [];
  selectCategoryId: string = '';
  categorias: Categoria[] = [];
  isloading = false;
  searchTerm: string = '';

  constructor(private router: Router, private subcategoriaService : SubcategoriaService , 
    private categoriaService: CategoriaService){}

  ngOnInit(): void {
      this.obtenerSubcategoria();
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
  
  obtenerSubcategoria(){
    this.subcategoriaService.getSubcategorias().subscribe({
      next: (obtener) =>{
        this.subcategorias = obtener;
        this.subcategoriasFiltrada = obtener;
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
    if(!this.selectCategoryId) {
      this.subcategoriasFiltrada = this.subcategorias;
    } else {
      this.subcategoriasFiltrada = this.subcategorias.filter(
        s => s.category.id === this.selectCategoryId
      );
    }
    this.cd.markForCheck();
  }


  addSubcategory(){
    const dialogRef = this.dialog.open(AddSubcategoriaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.obtenerSubcategoria();
      }
    })
  } 

  editSubcategory(subcategoria: Subcategoria){
    const dialogRef = this.dialog.open(EditSubcategoryComponent, {
      width: '70%',
      panelClass:'custom-dialog-container',
      data: subcategoria,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result === true){
        this.obtenerSubcategoria();
      }
    })
  }

  deleteSubcategory(id: string){
    const dialogRef = this.dialog.open(DeleteSubcategoryConfirmComponent,{
          width: '400px',
          disableClose:true,
    });

    dialogRef.afterClosed().subscribe((confirmacion) =>{
      if(confirmacion){
        this.subcategoriaService.eliminarSubcategoria(id).subscribe({
          next: ()=> {
            this.dialog.open(DeleteSubcategorySuccessComponent,{
                width: '400px',
                disableClose: true,
              });

                this.obtenerSubcategoria();
          },
          error: (err) => {
            console.error('error al eliminar la subcategoria', err);
          },
        })
      }
    })
  }

  onSearchTermChange(term: string) {
  this.searchTerm = term.trim();

  if (!this.searchTerm) {
    this.obtenerSubcategoria();
  }
}

  search() {
  const term = this.searchTerm.trim();

  if(!term) return;
  

  this.isloading = true;

  this.subcategoriaService.buscarSubcategoria(term).subscribe({
    next: (res) => {
      this.subcategorias = res;
      this.isloading = false;
      this.filtrarPorCategoria(); 
      this.cd.markForCheck();
    },
    error: (err) => {
      console.error('Error en la búsqueda :/', err);
      this.subcategorias = [];
      this.isloading = false;
      this.cd.markForCheck();
    }
  });
}


  page1(){
    this.router.navigate(['/almacenero/categoria-almacenero'])
  }
}
