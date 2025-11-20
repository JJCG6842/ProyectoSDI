import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject, ViewChild, AfterViewInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddMarcaComponent } from '../../../shared/modals-almacenero/add-marca/add-marca.component';
import { Marca } from '../../../interface/marca.interface';
import { MarcaService } from '../../../services/marca.service';
import { EditMarcaComponent } from '../../../shared/modals-almacenero/add-marca/edit-marca/edit-marca.component';
import { DeleteMarcaConfirmComponent } from '../../../shared/modals-almacenero/add-marca/modals-marca/delete-marca-confirm/delete-marca-confirm.component';
import { DeleteMarcaSuccessComponent } from '../../../shared/modals-almacenero/add-marca/modals-marca/delete-marca-success/delete-marca-success.component';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';

@Component({
  selector: 'app-marca-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormFieldModule,
    MatSelectModule, MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marca-almacenero.component.html',
  styleUrl: './marca-almacenero.component.scss'
})
export class MarcaAlmaceneroComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.pageSize = 6;
    }
  }

  get pagedMarcas(): Marca[] {
    if (!this.paginator) return this.marcaFiltrada;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return this.marcaFiltrada.slice(startIndex, startIndex + this.paginator.pageSize);
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
        if (this.paginator) {
          this.paginator.firstPage();
        }
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
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.cd.markForCheck();
  }

addMarca(){
  const dialogRef = this.dialog.open(AddMarcaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.obtenerMarca();
      }
    })
}

editMarca(marca: Marca){
  const dialogRef = this.dialog.open(EditMarcaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container',
      data: marca,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result === true){
        this.obtenerMarca();
      }
    })
}

deleteMarca(id: string){
  const dialogRef = this.dialog.open(DeleteMarcaConfirmComponent,{
            width: '400px',
            disableClose:true,
    });

    dialogRef.afterClosed().subscribe((confirmacion) => {
      if(confirmacion){
        this.marcaService.eliminarMarca(id).subscribe({
          next: () => {
            this.dialog.open(DeleteMarcaSuccessComponent,{
                width: '400px',
                disableClose: true,
                });

                this.obtenerMarca();
          },
          error: (err) => {
            console.error('error al eliminar la marca', err);
          },
        })
      }
    })
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
  this.router.navigate(['/almacenero/categoria-almacenero'])
}

}
