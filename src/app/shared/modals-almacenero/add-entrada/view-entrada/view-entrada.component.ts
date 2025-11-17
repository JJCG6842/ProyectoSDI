import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../../services/entrada.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interface/categoria.interface';
import { Entrada } from '../../../../interface/entrada.interface';
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
  selector: 'app-view-entrada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-entrada.component.html',
  styleUrl: './view-entrada.component.scss'
})
export class ViewEntradaComponent implements OnInit {

  entrada: Entrada | null = null
  cantidadTotal = 0;
  montoTotal = 0;
  categorias: Categoria[] = [];

  private cd = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private categoriaService: CategoriaService, 
    private entradaService: EntradaService) { }

    ngOnInit(): void {
      this.cargarCategorias();
      this.cargarEntradaById();
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

  cargarEntradaById(){
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      console.error('No recibio el ID');
      return;
    }

    this.entradaService.getEntradaPorId(id).subscribe({
      next: (data) =>{
        this.entrada = data;

        this.cantidadTotal = data.detalles.reduce((acc, d) => acc + d.quantity, 0);
        this.montoTotal = data.detalles.reduce((acc, d) => acc + d.total, 0);

        this.cd.markForCheck();
      },
      error: (err) => console.error('Error al obtener categoria', err)
    });
  }

  exportarPDF() {
  if (!this.entrada) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Detalle de Entrada', 14, 20);

  doc.setFontSize(12);
  doc.text(
    `Fecha: ${new Date(this.entrada.createdAt).toLocaleString()}`, 
    14, 
    35
  );

  doc.text(
    `Proveedor: ${this.entrada.supplier?.name || 'Sin proveedor'}`,
    14,
    43
  );

  const rows = this.entrada.detalles.map((d, index) => [
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

  const fileName = `Entrada-${this.entrada.id}.pdf`;

  doc.save(fileName);
}

  getCategoriaName(id: string): string {
    return this.categorias.find(c => c.id === id)?.name || 'No definido';
  }

  gestor() {
    this.router.navigate(['/almacenero/entrada-almacenero']);
  }

}
