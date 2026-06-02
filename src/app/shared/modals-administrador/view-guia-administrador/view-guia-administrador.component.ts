import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaService } from '../../../services/entrada.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria.interface';
import { Entrada } from '../../../interface/entrada.interface';
import { GuiaRemision } from '../../../interface/guia_remision';
import { GuiaRemisionService } from '../../../services/guia_remision.service';
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
  selector: 'app-view-guia-administrador',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './view-guia-administrador.component.html',
  styleUrl: './view-guia-administrador.component.scss'
})
export class ViewGuiaAdministradorComponent implements OnInit,AfterViewInit{

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  guia: any = null;

  detallesPaginados: any[] = [];

  cantidadTotal = 0;

  pageSize = 5;
  pageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private guiaService: GuiaRemisionService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarGuia();
  }

  ngAfterViewInit(): void {

    this.paginator.page.subscribe(() => {

      this.pageIndex =
        this.paginator.pageIndex;

      this.pageSize =
        this.paginator.pageSize;

      this.aplicarPaginacion();

    });
  }

  getSeriales(detalle: any): string {
  if (!detalle.serialNumbers?.length) {
    return '---';
  }
  return detalle.serialNumbers
    .map((s: any) => s.serial)
    .join(', ');
}

  cargarGuia() {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.guiaService.getGuiaById(id)
      .subscribe({

        next: (res) => {

          this.guia = res;

          this.cantidadTotal =
            res.detalles.reduce(
              (acc:any, d:any) =>
                acc + d.cantidad,
              0
            );

          this.aplicarPaginacion();

          this.cd.markForCheck();
        }

      });
  }

  aplicarPaginacion() {

    if (!this.guia) return;

    const start =
      this.pageIndex * this.pageSize;

    const end =
      start + this.pageSize;

    this.detallesPaginados =
      this.guia.detalles.slice(start, end);

    this.cd.markForCheck();
  }

  async exportarPDF() {

  if (!this.guia) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFontSize(20);

  doc.text(
    'Detalle del Pedido',
    100,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Numero: ${this.guia.numero}`,
    15,
    35
  );

  doc.text(
    `Fecha: ${
      new Date(
        this.guia.createdAt
      ).toLocaleDateString()
    }`,
    15,
    42
  );

  doc.text(
    `Proveedor: ${
      this.guia.supplier?.name
    }`,
    15,
    49
  );

  doc.text(
    `Estado: ${this.guia.estado}`,
    15,
    56
  );

  const rows =
    this.guia.detalles.map(
      (d:any, index:number) => [

        index + 1,

        d.product?.name,

        d.cantidad,

        d.serialNumbers?.length
          ? d.serialNumbers
              .map((s:any) => s.serial)
              .join(', ')
          : '---'
      ]
    );

  autoTable(doc, {

    startY: 65,

    head: [[
      '#',
      'Producto',
      'Cantidad',
      'N° Serie'
    ]],

    body: rows,

    theme: 'grid',

    styles: {
      fontSize: 10
    },

    headStyles: {
      fillColor: [132, 1, 255],
      textColor: 255,
      halign: 'center'
    },

    bodyStyles: {
      halign: 'center'
    }

  });

  const finalY =
    (doc as any)
      .lastAutoTable.finalY + 10;

  doc.setFontSize(14);

  doc.text(
    `Cantidad Total: ${this.cantidadTotal}`,
    15,
    finalY
  );

  doc.save(
    `Pedido-${this.guia.numero}.pdf`
  );
}

exportarExcel() {

  if (!this.guia) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Guia Remision');

  sheet.columns = [
    {
      header: '#',
      key: 'index',
      width: 21
    },
    {
      header: 'Producto',
      key: 'producto',
      width: 60
    },
    {
      header: 'Cantidad',
      key: 'cantidad',
      width: 15
    },
    {
      header: 'N° Serie',
      key: 'serie',
      width: 60
    }
  ];

  sheet.getCell('B2').value = 'Detalle del Pedido';
  sheet.mergeCells('B2:D2');

  sheet.getCell('B2').font = {
    size: 18,
    bold: true
  };

  sheet.getCell('B2').alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  sheet.getCell('A4').value = 'Numero:';
  sheet.getCell('B4').value = this.guia.numero;

  sheet.getCell('A5').value = 'Fecha:';
  sheet.getCell('B5').value = new Date(
    this.guia.createdAt
  ).toLocaleString();

  sheet.getCell('A6').value = 'Proveedor:';
  sheet.getCell('B6').value =
    this.guia.supplier?.name || '';

  sheet.getCell('A7').value = 'Estado:';
  sheet.getCell('B7').value =
    this.guia.estado;

  const headerRow = sheet.getRow(9);

  headerRow.values = [
    '#',
    'Producto',
    'Cantidad',
    'N° Serie'
  ];

  headerRow.eachCell((cell) => {

    cell.font = {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    };

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF8401FF'
      }
    };

    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

  });

  let currentRow = 10;

  this.guia.detalles.forEach(
    (d: any, i: number) => {

      const series =
        d.serialNumbers?.length
          ? d.serialNumbers
              .map((s: any) => s.serial)
              .join(', ')
          : '---';

      const row = sheet.getRow(currentRow);

      row.values = [
        i + 1,
        d.product?.name,
        d.cantidad,
        series
      ];

      row.eachCell((cell, colNumber) => {

        cell.alignment = {
          horizontal:
            colNumber === 4
              ? 'left'
              : 'center',
          vertical: 'middle',
          wrapText: true
        };

      });

      currentRow++;

    }
  );

  currentRow++;


  const totalRow = sheet.getRow(currentRow);

  totalRow.values = [
    'Cantidad Total:',
    this.cantidadTotal
  ];

  totalRow.getCell(1).font = {
    bold: true
  };

  totalRow.getCell(2).font = {
    bold: true
  };

  totalRow.getCell(2).alignment = {
    horizontal: 'left'
  };

  workbook.xlsx.writeBuffer()
    .then((buffer) => {

      saveAs(
        new Blob(
          [buffer],
          {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ),
        `Guia-${this.guia.numero}.xlsx`
      );

    });

}

gestor() {
    this.router.navigate([
      '/administrador/guia-remision-administrador'
    ]);
  }
}
