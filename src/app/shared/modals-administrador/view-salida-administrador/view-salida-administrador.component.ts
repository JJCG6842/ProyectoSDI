import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalidaService } from '../../../services/salida.service';
import { Salida } from '../../../interface/salida.interface';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
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
  selector: 'app-view-salida-administrador',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './view-salida-administrador.component.html',
  styleUrls: ['./view-salida-administrador.component.scss']
})
export class ViewSalidaAdministradorComponent implements OnInit {

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
        this.montoTotal = data.detalles.reduce((acc, d) => acc + d.total, 0);

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
    this.router.navigate(['/administrador/salida-administrador']);
  }

  exportarPDF() {
    if (!this.salida) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Detalle de Salida', 14, 20);

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(this.salida.createdAt).toLocaleString()}`, 14, 35);

    doc.text(`Tipo de salida: ${this.salida.tiposalida}`, 14, 43);

    let infoExtra = 'N/A';
    if (this.salida.tiposalida === 'Venta') {
      infoExtra = this.salida.cliente?.name || 'N/A';
      doc.text(`Cliente: ${infoExtra}`, 14, 51);
    } else if (this.salida.tiposalida === 'Devolucion') {
      infoExtra = this.salida.supplier?.name || 'N/A';
      doc.text(`Proveedor: ${infoExtra}`, 14, 51);
    }

    const rows = this.salida.detalles.map((d, index) => [
      index + 1,
      this.getCategoriaName(d.product.categoryId),
      d.product.name,
      d.quantity,
      `S/. ${d.price}`,
      `S/. ${d.total}`
    ]);

    autoTable(doc, {
      startY: 60,
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

  exportarExcel() {
    if (!this.salida) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Salida');

    sheet.columns = [
      { header: '#', key: 'index', width: 38 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Producto', key: 'producto', width: 65 },
      { header: 'Cantidad', key: 'cantidad', width: 18 },
      { header: 'Precio', key: 'precio', width: 20 },
      { header: 'Total', key: 'total', width: 30 },
    ];

    const titleRow = sheet.addRow(['Detalle de Salida']);
    titleRow.font = { size: 18, bold: true };
    sheet.mergeCells('A1:F1');
    titleRow.alignment = { horizontal: 'center' };

    sheet.addRow([]);

    sheet.addRow(['Fecha:', new Date(this.salida.createdAt).toLocaleString()]);
    sheet.addRow(['Tipo de salida:', this.salida.tiposalida]);

    let infoExtra = 'N/A';
    if (this.salida.tiposalida === 'Venta') {
      infoExtra = this.salida.cliente?.name || 'N/A';
      sheet.addRow(['Cliente:', infoExtra]);
    } else if (this.salida.tiposalida === 'Devolucion') {
      infoExtra = this.salida.supplier?.name || 'N/A';
      sheet.addRow(['Proveedor:', infoExtra]);
    } else {
      sheet.addRow(['Información adicional:', 'N/A']);
    }

    sheet.addRow([]);

    const headerRow = sheet.addRow(['#', 'Categoría', 'Producto', 'Cantidad', 'Precio', 'Total']);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    this.salida.detalles.forEach((d, i) => {
      const row = sheet.addRow([
        i + 1,
        this.getCategoriaName(d.product.categoryId),
        d.product.name,
        d.quantity,
        d.price,
        d.total,
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });
    });

    sheet.addRow([]);

    const totalCantidad = sheet.addRow(['Cantidad Total:', this.cantidadTotal]);
    const totalMonto = sheet.addRow(['Monto Total:', this.montoTotal]);

    totalCantidad.eachCell((cell) => (cell.font = { bold: true }));
    totalMonto.eachCell((cell) => (cell.font = { bold: true }));

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `Salida-${this.salida!.id}.xlsx`
      );
    });
  }
}
