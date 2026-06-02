import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalidaService } from '../../../../services/salida.service';
import { Salida } from '../../../../interface/salida.interface';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interface/categoria.interface';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './view-salida.component.html',
  styleUrls: ['./view-salida.component.scss']
})
export class ViewSalidaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;
  pageIndex = 0;

  detallesPaginados: any[] = [];
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
  ) { }

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

        this.aplicarPaginacion();
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error obteniendo salida', err)
    });
  }

  aplicarPaginacion() {
    if (!this.salida) return;

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.detallesPaginados = this.salida.detalles.slice(start, end);

    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.aplicarPaginacion();
      });
    }
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
    doc.text(`Usuario: ${this.salida.user?.nombre || 'N/A'}`, 14, 42);
    doc.text(`Asignado a: ${this.salida.asignadoA || 'N/A'}`, 14, 49);

    const rows = this.salida.detalles.map((d, index) => [
      index + 1,
      this.getCategoriaName(d.product.categoryId),
      d.product.name,
      d.quantity,
    ]);

    autoTable(doc, {
      startY: 58,
      head: [['#', 'Categoría', 'Producto', 'Cantidad']],
      body: rows,
      theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Cantidad total: ${this.cantidadTotal}`, 14, finalY);

    const fileName = `Salida-${this.salida.id}.pdf`;
    doc.save(fileName);
  }

  exportarExcel() {

  if (!this.salida) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Salida');

  sheet.columns = [
    { header: '#', key: 'index', width: 20 },
    { header: 'Categoría', key: 'categoria', width: 30 },
    { header: 'Producto', key: 'producto', width: 86 },
    { header: 'Cantidad', key: 'cantidad', width: 21 }
  ];

  sheet.getCell('B2').value = 'Detalle de Salida';
  sheet.mergeCells('B2:D2');

  sheet.getCell('B2').font = {
    size: 18,
    bold: true
  };

  sheet.getCell('B2').alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  sheet.getCell('A4').value = 'Fecha:';
  sheet.getCell('B4').value =
    new Date(this.salida.createdAt).toLocaleString();

  sheet.getCell('A5').value = 'Usuario:';
  sheet.getCell('B5').value =
    this.salida.user?.nombre || 'N/A';

  sheet.getCell('A6').value = 'Asignado a:';
  sheet.getCell('B6').value =
    this.salida.asignadoA || 'N/A';

  const headerRow = sheet.getRow(9);

  headerRow.values = [
    '#',
    'Categoría',
    'Producto',
    'Cantidad'
  ];

  headerRow.eachCell((cell) => {

    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDC3545' }
    };

    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

  });

  let currentRow = 10;

  this.salida.detalles.forEach((d, i) => {

    const row = sheet.getRow(currentRow);

    row.values = [
      i + 1,
      this.getCategoriaName(d.product.categoryId),
      d.product.name,
      d.quantity
    ];

    row.eachCell((cell) => {

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };

    });

    row.height = 30;

    currentRow++;

  });

  currentRow++;

  const totalRow = sheet.getRow(currentRow);

  totalRow.values = [
    'Cantidad Total:',
    this.cantidadTotal
  ];

  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(2).font = { bold: true };

  workbook.xlsx.writeBuffer().then((buffer) => {

    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      `Salida-${this.salida!.id}.xlsx`
    );

  });

}
}
