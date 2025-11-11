import { Component, ChangeDetectionStrategy,inject,ChangeDetectorRef, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntradaService } from '../../../services/entrada.service';
import { Entrada } from '../../../interface/entrada.interface';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Producto } from '../../../interface/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entradas-administrador',
  imports: [MatExpansionModule, MatIconModule, MatDialogModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entradas-administrador.component.html',
  styleUrl: './entradas-administrador.component.scss'
})
export class EntradasAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog)
  readonly reload = inject(ChangeDetectorRef);
  isloading = false;
  searchTerm: string = '';
  productos: Producto[] = [];
  entradas: Entrada[] = [];

  constructor(private router: Router, private productoService: ProductoService, private entradaService:EntradaService){}

  ngOnInit(): void {
      this.cargarEntradas();
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

  cargarEntradas() {
    this.entradaService.getEntradas().subscribe({
      next: (data) => {
        this.entradas = data;
        this.isloading = false;
        this.reload.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar entradas:', err);
        this.isloading = false;
      },
    });
  }

  search() {
  const term = this.searchTerm.trim();

  if (!term) {
    this.cargarEntradas();
    return;
  }

  this.isloading = true;

  this.entradaService.buscarPorProducto(term).subscribe({
    next: (res) => {
      this.entradas = res;
      this.isloading = false;
      this.reload.markForCheck();
    },
    error: (err) => {
      console.error('Error al buscar entradas:', err);
      this.entradas = [];
      this.isloading = false;
      this.reload.markForCheck();
    },
  });
}

  onSearchTermChange(term: string) {
  this.searchTerm = term.trim();
  if (!this.searchTerm) {
    this.cargarEntradas();
  } 
}

  kardex(){
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

  salidas(){
    this.router.navigate(['/administrador/salida-administrador'])
  }
}
