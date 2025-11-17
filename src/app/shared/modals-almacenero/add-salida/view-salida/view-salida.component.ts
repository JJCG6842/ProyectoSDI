import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalidaService } from '../../../../services/salida.service';
import { Salida } from '../../../../interface/salida.interface';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interface/categoria.interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

@Component({
  selector: 'app-view-salida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-salida.component.html',
  styleUrls: ['./view-salida.component.scss']
})
export class ViewSalidaComponent implements OnInit {

  salida: Salida | null = null;
  cantidadTotal = 0;
  montoTotal = 0;
  categorias: Categoria[] = [];

  private cd = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salidaService: SalidaService,
    private categoriaService: CategoriaService   
  ) {}

  ngOnInit(): void {
    this.cargarCategorias(); 
    this.cargarSalidaById();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: res => {
        this.categorias = res;
        this.cd.markForCheck();
      },
      error: err => console.error('Error cargando categorías', err)
    });
  }

  cargarSalidaById() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('No se recibió ID');
      return;
    }

    this.salidaService.getSalidaById(id).subscribe({
      next: (data) => {
        this.salida = data;

        this.cantidadTotal = data.detalles.reduce((acc, d) => acc + d.quantity, 0);
        this.montoTotal = data.detalles.reduce((acc, d) => acc + d.total, 0);

        this.cd.markForCheck();
      },
      error: (err) => console.error('Error obteniendo salida', err)
    });
  }

  getCategoriaName(id: string): string {
    return this.categorias.find(c => c.id === id)?.name || 'No definido';
  }

  gestor() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }

  exportarPDF() {
    if (!this.salida) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Detalle de Salida', 14, 20);

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(this.salida.createdAt).toLocaleString()}`, 14, 35);

    const tipo = this.salida.tipo === 'cliente' ? 'Cliente' : 'Proveedor';
    const nombre = this.salida.cliente?.name || this.salida.supplier?.name || 'N/A';

    doc.text(`${tipo}: ${nombre}`, 14, 43);

    const rows = this.salida.detalles.map((d, index) => [
      index + 1,
      this.getCategoriaName(d.product.categoryId),
      d.product.name,
      d.quantity,
      `S/. ${d.price}`,
      `S/. ${d.total}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['#', 'Categoría', 'Producto', 'Cantidad', 'Precio', 'Total']],
      body: rows,
      theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Cantidad total: ${this.cantidadTotal}`, 14, finalY);
    doc.text(`Monto total: S/. ${this.montoTotal}`, 14, finalY + 10);

    const fileName = `Salida-${this.salida.id}.pdf`;
    doc.save(fileName);
  }
}
