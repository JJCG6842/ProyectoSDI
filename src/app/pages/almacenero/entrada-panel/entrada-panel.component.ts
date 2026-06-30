import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { GuiaRemisionService } from '../../../services/guia_remision.service';
import { ProductoService } from '../../../services/producto.service';
import { EntradaService } from '../../../services/entrada.service';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { AddEntradaSuccessComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/add-entrada-success/add-entrada-success.component';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
import { ProveedorNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/proveedor-null/proveedor-null.component';
import { shareReplay } from 'rxjs';


@Component({
  selector: 'app-entrada-panel',
  imports: [
    MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule,
    MatDialogModule, FormsModule, ReactiveFormsModule,
    MatOptionModule, MatInputModule, MatPaginatorModule
  ],
  templateUrl: './entrada-panel.component.html',
  styleUrl: './entrada-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntradaPanelComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);

  formProveedor!: FormGroup;
  proveedores: any[] = [];
  tipoentrada = new FormControl('', Validators.required);
  cliente = new FormControl('');
  clientes: any[] = [];
  tipoEntrada: 'DIRECTA' | 'GUIA' = 'GUIA';
  entradasRegistradas: any[] = [];
  paginadasEntradas: any[] = [];
  guias: any[] = [];
  guiaSeleccionadaId: string = '';
  numeroGuia: string = '';
  motivo: string = 'COMPRA';
  pageSize: number = 5;
  pageIndex: number = 0;

  productos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private entradaService: EntradaService,
    private guiaService: GuiaRemisionService,
    private route: Router
  ) {
    this.formProveedor = this.fb.group({
      proveedor: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarGuias();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.aplicarPaginacion();
      });
    }
  }

  aplicarPaginacion() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginadasEntradas = this.entradasRegistradas.slice(start, end);
    this.cd.markForCheck();
  }

  onTipoEntradaChange() {
  this.guiaSeleccionadaId = '';
  this.entradasRegistradas = [];
  this.proveedor.reset('');
  this.aplicarPaginacion();
}

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => this.proveedores = proveedores,
      error: (err) => console.error('Error al cargar proveedores', err)
    });
  }

  cargarGuias() {

  this.guiaService.getGuias().subscribe({
    next: (res) => {
      this.guias = res.filter(
        (g: any) => g.estado === 'RECIBIDO'
      );

      this.cd.markForCheck();
    },

    error: (err) => {
      console.error(
        'Error al cargar guías',
        err
      );
    }
  });
}

cargarGuia() {

  if (!this.guiaSeleccionadaId) return;

  this.guiaService
    .getGuiaById(this.guiaSeleccionadaId)
    .subscribe({

      next: (guia) => {

        this.proveedor.setValue(
          guia.supplierId
        );

        this.entradasRegistradas = [];

        this.entradasRegistradas =
          guia.detalles.map((d: any) => ({

            tipoentrada: 'GUIA',

            guiaRemision: {
              numeroGuia: guia.numero
            },

            productId: d.productId,

            productName:
              d.product?.name,

            quantity:
              d.cantidad,

            serialNumbers:
              d.serialNumbers?.map(
                (s: any) => s.serial
              ) || []

          }));

        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.cd.markForCheck();

      },

      error: (err) => {
        console.error('Error al cargar guía',err);
      }
    });
}

  get proveedor() {
    return this.formProveedor.get('proveedor') as FormControl;
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddEntradaComponent, {
      width: '550px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { productId, productName, quantity,category,serialNumbers } = result;


        this.entradasRegistradas.push({ tipoentrada: this.tipoEntrada,guiaRemision: null, productId, productName, quantity, category, serialNumbers });

        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.cd.markForCheck();
      }
    });
  }

  eliminarEntrada(index: number) {
    const realIndex = (this.pageIndex * this.pageSize) + index;
    this.entradasRegistradas.splice(realIndex, 1);
    this.aplicarPaginacion();
  }

  realizarEntrada() {
  if (this.entradasRegistradas.length === 0) {
    this.dialog.open(ProductNullComponent, {
      width: '400px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container'
    });
    return;
  }

  if (
  this.tipoEntrada === 'GUIA' &&
  !this.proveedor.getRawValue()
) {
  this.dialog.open(ProveedorNullComponent, {
    width: '400px',
    maxWidth: 'none',
    panelClass: 'custom-dialog-container'
  });

  return;
}

  const productos = this.entradasRegistradas.map(p => ({
    productId: p.productId,
    quantity: p.quantity,
    serialNumbers: p.serialNumbers
  }));

  const payload = {
  tipoentrada: this.tipoEntrada,

  supplierId:
    this.tipoEntrada === 'GUIA'
      ? this.proveedor.getRawValue()
      : null,

  guiaId:
    this.tipoEntrada === 'GUIA'
      ? this.guiaSeleccionadaId
      : null,

  productos
};

  this.entradaService.crearEntrada(payload).subscribe({
    next: res => {
      this.dialog.open(AddEntradaSuccessComponent, { data: res });
      this.entradasRegistradas = [];
      this.aplicarPaginacion();
      this.route.navigate(['/almacenero/entrada-almacenero']);
    },
    error: err => console.error('Error al crear entrada', err)
  });
}

  gestor() {
    this.route.navigate(['/almacenero/entrada-almacenero']);
  }

  getCantidadTotal(): number {
    return this.entradasRegistradas.reduce((sum, item) => sum + item.quantity, 0);
  }
}
