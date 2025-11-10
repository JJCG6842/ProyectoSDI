import { Component, ChangeDetectionStrategy , OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../services/entrada.service';
import { SalidaService } from '../../../services/salida.service';
import { firstValueFrom } from 'rxjs';
import { Entrada } from '../../../interface/entrada.interface';
import { Salida } from '../../../interface/salida.interface';

@Component({
  selector: 'app-kardex-administrador',
  imports: [MatExpansionModule,MatIconModule,MatFormFieldModule,MatSelectModule,MatInputModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kardex-administrador.component.html',
  styleUrl: './kardex-administrador.component.scss'
})
export class KardexAdministradorComponent implements OnInit {

  movimientos: any[] = [];
  filtroProducto = '';
  tipoFiltro: 'todos' | 'entrada' | 'salida' = 'todos';
  ordenFecha: 'asc' | 'desc' = 'desc';
  isLoading = true;

  constructor(
    private entradaService: EntradaService,
    private salidaService: SalidaService,
    private router:Router
  ) {}

  async ngOnInit() {
    await this.cargarMovimientos();
  }

  async cargarMovimientos() {
    this.isLoading = true;
    try {
      const [entradas, salidas] = await Promise.all([
        firstValueFrom(this.entradaService.getEntradas()),
        firstValueFrom(this.salidaService.getSalidas())
      ]);

      const entradasFormateadas = (entradas ?? []).map(e => ({
        fecha: e.createdAt,
        movimiento: 'Entrada',
        proveedor: e.supplier?.name ?? '—',
        producto: e.product?.name ?? '—',
        cantidad: e.quantity,
        precio: e.product?.price ?? 0,
        total: e.quantity * (e.product?.price ?? 0)
      }));

      const salidasFormateadas = (salidas ?? []).map(s => ({
        fecha: s.createdAt,
        movimiento: 'Salida',
        proveedor: s.supplier?.name ?? '—',
        producto: s.product?.name ?? '—',
        cantidad: s.quantity,
        precio: s.product?.price ?? 0,
        total: s.quantity * (s.product?.price ?? 0)
      }));

      this.movimientos = [...entradasFormateadas, ...salidasFormateadas];
      this.ordenarMovimientos();
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get movimientosFiltrados() {
    return this.movimientos
      .filter(mov => {
        const coincideProducto = mov.producto
          .toLowerCase()
          .includes(this.filtroProducto.toLowerCase());
        const coincideTipo =
          this.tipoFiltro === 'todos' ||
          (this.tipoFiltro === 'entrada' && mov.movimiento === 'Entrada') ||
          (this.tipoFiltro === 'salida' && mov.movimiento === 'Salida');
        return coincideProducto && coincideTipo;
      })
      .sort((a, b) =>
        this.ordenFecha === 'desc'
          ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  }

  ordenarMovimientos() {
    this.movimientos.sort((a, b) =>
      this.ordenFecha === 'desc'
        ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }

  search(){

  }

  entradas() {
    this.router.navigate(['/almacenero/entrada-almacenero']);
  }

  salidas() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }
}
