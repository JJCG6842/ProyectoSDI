import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSalidaComponent } from '../../../shared/modals-almacenero/add-salida/add-salida.component';
import { ProveedorService } from '../../../services/proveedor.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { SalidaService } from '../../../services/salida.service';
import { Proveedor } from '../../../interface/proveedor.interface';
import { Cliente } from '../../../interface/cliente.interface';
import { AddSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/add-salida-success/add-salida-success.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TipoSalida } from '../../../environments/tipos-salida.type';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
import { TipoSalidaNullComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/tipo-salida-null/tipo-salida-null.component';
import { Usuario } from '../../../interface/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-salida-panel',
  imports: [
    MatFormFieldModule, CommonModule, MatSelectModule, MatIconModule,
    MatDialogModule, FormsModule, ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './salida-panel.component.html',
  styleUrl: './salida-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalidaPanelComponent implements OnInit {

  private dialog = inject(MatDialog);
  private cd = inject(ChangeDetectorRef);

  formUser!: FormGroup;
  salidas: any[] = [];
  selectedOpcion: string = '';
  selectedUserId: string = '';
  currentUserId: string = '';
  usuarios: Usuario[] = [];
  salidasFiltradas: any[] = [];
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private salidaService: SalidaService,
    private usuarioService: UsuarioService
  ) { 
    this.formUser = this.fb.group({
      destino: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get destino (){
    return this.formUser.get('destino') as FormControl;
  }

  get pagedSalidas() {
    const start = this.pageIndex * this.pageSize;
    return this.salidas.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cd.markForCheck();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuario().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.cd.markForCheck();
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddSalidaComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salidas.push(result);
        this.pageIndex = 0;
        this.cd.markForCheck();
      }
    });
  }

  get totalCantidad() {
    return this.salidas.reduce((acc, item) => acc + item.quantity, 0);
  }

  filtrarPorUsuario() {
    if (!this.selectedUserId) {
      this.salidasFiltradas = [...this.salidas];
    } else {
      this.salidasFiltradas = this.salidas.filter(
        salida => salida.userId === this.selectedUserId
      );
    }
    this.pageIndex = 0;
    this.cd.markForCheck();
  }

  deleteSalida(index: number) {
    this.salidas.splice(index, 1);
    this.pageIndex = 0;
    this.cd.markForCheck();
  }

  async realizarSalida() {
    if (this.salidas.length === 0) {
      this.dialog.open(ProductNullComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container'
      });
      return;
    }

    if (!this.destino.value) {
      return
    }

    for (const item of this.salidas) {
      const producto = await this.productoService.getProductoporId(item.productId).toPromise();

      if (!producto) {
        alert(`Producto ${item.productName} no encontrado`);
        return;
      }

      if (item.quantity > producto.quantity) {
        alert(`Cantidad solicitada de ${item.productName} supera el stock`);
        return;
      }
    }

    const productos = this.salidas.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
    }));

    const storedUser = localStorage.getItem('usuario');
    const user = storedUser ? JSON.parse(storedUser) : null;


    const data = {
      userId: user?.id,
      destinoId: this.destino.value,
      productos
    };

    const destinoSeleccionado = this.usuarios.find(u => u.id === this.destino.value);

    this.salidaService.createSalida(data).subscribe({
      next: (res) => {
        this.dialog.open(AddSalidaSuccessComponent);
        this.salidas = [];
        res.destinoNombre = destinoSeleccionado?.nombre ?? '---';
        this.router.navigate(['/almacenero/salida-almacenero']);
      },
      error: err => console.error(err)
    });
  }

  gestor() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }
}
