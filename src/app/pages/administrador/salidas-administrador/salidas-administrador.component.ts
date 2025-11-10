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

@Component({
  selector: 'app-salidas-administrador',
  imports: [MatExpansionModule,MatIconModule,MatDialogModule,CommonModule],
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

  kardex(){
    this.router.navigate(['/administrador/panel-inventario-administrador'])
  }

  entradas(){
    this.router.navigate(['/administrador/entrada-administrador'])
  }
}
