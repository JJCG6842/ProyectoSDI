import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../../services/entrada.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../interface/categoria.interface';
import { Entrada } from '../../../../interface/entrada.interface';
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
  selector: 'app-view-entrada',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './view-entrada.component.html',
  styleUrl: './view-entrada.component.scss'
})
export class ViewEntradaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;
  pageIndex = 0;
  detallesPaginados: any[] = [];
  entrada: Entrada | null = null
  cantidadTotal = 0;
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

  cargarEntradaById() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.entradaService.getEntradaPorId(id).subscribe({
      next: (data) => {
        this.entrada = data;
        this.cantidadTotal = data.detalles.reduce((acc, d) => acc + d.quantity, 0);

        this.aplicarPaginacion();
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error al obtener entrada', err)
    });
  }

  aplicarPaginacion() {
    if (!this.entrada) return;

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.detallesPaginados = this.entrada.detalles.slice(start, end);

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

  // convertImageToBase64(url: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = 'Anonymous';
  //     img.src = url;

  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       const ctx = canvas.getContext('2d');
  //       ctx?.drawImage(img, 0, 0);

  //       resolve(canvas.toDataURL('image/png'));
  //     };

  //     img.onerror = error => reject(error);
  //   });
  // }

  async exportarPDF() {
    if (!this.entrada) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFontSize(20);
    doc.text('Detalle de Entrada', 50, 25);

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(this.entrada.createdAt).toLocaleDateString()}`, 50, 35);
    doc.text(`Tipo: ${this.entrada.guia? 'GUIA': 'DIRECTA'}`,50,47);
    doc.text(`Nro Guia: ${this.entrada.guia?.numero || '---'}`,50,53);
    doc.text(`Proveedor: ${this.entrada.supplier?.name || 'Sin proveedor'}`, 50, 41);

    const rows = this.entrada.detalles.map((d, index) => [
      index + 1,
      d.product.name,
      d.quantity,
      d.serialNumbers?.length
        ? d.serialNumbers.map(sn => sn.serial).join(', ')
        : '---',
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['#', 'Producto', 'Cantidad', 'N° Serie']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [31, 78, 120], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'center' }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);

    doc.save(`Entrada-${this.entrada.id}.pdf`);
  }


  exportarExcel() {
  if (!this.entrada) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Entrada');

  sheet.columns = [
    { header: '#', key: 'index', width: 16 },
    { header: 'Categoría', key: 'categoria', width: 26 },
    { header: 'Producto', key: 'producto', width: 72 },
    { header: 'Cantidad', key: 'cantidad', width: 16 },
    { header: 'N° Serie', key: 'serie', width: 56 },
  ];

  const titleRow = sheet.addRow(['Detalle de entrada']);

  sheet.mergeCells('A1:E1');

  const titleCell = titleRow.getCell(1);
  titleCell.font = { size: 18, bold: true };
  titleCell.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  titleRow.height = 25;

  sheet.addRow([]);

  sheet.addRow(['Fecha:', new Date(this.entrada.createdAt).toLocaleString()]);
  sheet.addRow(['Proveedor:', this.entrada.supplier?.name || 'Sin proveedor']);
  sheet.addRow(['Tipo:', this.entrada.guia ? 'GUIA' : 'DIRECTA']);

sheet.addRow([
  'Nro Guia:',
  this.entrada.guia?.numero || '---'
]);

  sheet.addRow([]);

  const headerRow = sheet.addRow([
    '#',
    'Categoría',
    'Producto',
    'Cantidad',
    'N° Serie'
  ]);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  this.entrada.detalles.forEach((d, i) => {
    const series = d.serialNumbers?.length
      ? d.serialNumbers.map(sn => sn.serial).join(', ')
      : '---';

    const row = sheet.addRow([
      i + 1,
      this.getCategoriaName(d.product.categoryId),
      d.product.name,
      d.quantity,
      series
    ]);

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.alignment = {
        horizontal: colNumber === 5 ? 'left' : 'center',
        vertical: 'middle',
        wrapText: true
      };
    });

    row.height = 20;
  });

  sheet.addRow([]);

  const totalCantidad = sheet.addRow([
    'Cantidad Total:',
    this.cantidadTotal
  ]);

  totalCantidad.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'left' };
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      `Entrada-${this.entrada!.id}.xlsx`
    );
  });
}

  getCategoriaName(id: string): string {
    return this.categorias.find(c => c.id === id)?.name || 'No definido';
  }

  gestor() {
    this.router.navigate(['/almacenero/entrada-almacenero']);
  }
}