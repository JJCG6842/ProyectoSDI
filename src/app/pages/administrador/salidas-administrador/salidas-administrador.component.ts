import { Component, ChangeDetectionStrategy, inject,ChangeDetectorRef, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SalidaService } from '../../../services/salida.service';
import { Salida } from '../../../interface/salida.interface';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salidas-administrador',
  imports: [MatExpansionModule,MatIconModule,MatDialogModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salidas-administrador.component.html',
  styleUrl: './salidas-administrador.component.scss'
})
export class SalidasAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  salidas: Salida[] =[];

  constructor(private router: Router,private productoService: ProductoService, 
    private salidaService: SalidaService ){}

    ngOnInit(): void {
      this.cargarSalidas();
      this.cargarProductos();
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

    cargarSalidas(){
      this.salidaService.getSalidas().subscribe({
        next: (data) => {
        this.salidas = data;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar salidas:', err);
        this.isloading = false;
      },
      })
    }

  search() {
  const term = this.searchTerm.trim();

  if (!term) {
    this.cargarSalidas();
    return;
  }

  this.isloading = true;

  this.salidaService.buscarPorProducto(term).subscribe({
    next: (res) => {
      this.salidas = res;
      this.isloading = false;
      this.reload.markForCheck();
    },
    error: (err) => {
      console.error('Error al buscar salidas:', err);
      this.salidas = [];
      this.isloading = false;
      this.reload.markForCheck();
    },
  });
}

onSearchTermChange(term: string) {
  this.searchTerm = term.trim();
  if (!this.searchTerm) {
    this.cargarSalidas();
  } 
}

  kardex(){
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

  entradas(){
    this.router.navigate(['/administrador/entrada-administrador'])
  }
}
