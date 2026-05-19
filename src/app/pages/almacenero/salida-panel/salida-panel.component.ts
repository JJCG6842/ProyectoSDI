import { Component, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSalidaComponent } from '../../../shared/modals-almacenero/add-salida/add-salida.component';
import { ProductoService } from '../../../services/producto.service';
import { SalidaService } from '../../../services/salida.service';
import { AddSalidaSuccessComponent } from '../../../shared/modals-almacenero/add-salida/modals-salida/add-salida-success/add-salida-success.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductNullComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/product-null/product-null.component';
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
export class SalidaPanelComponent {

  private dialog = inject(MatDialog);
  private cd = inject(ChangeDetectorRef);
  salidas: any[] = [];
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private salidaService: SalidaService,
  ) { }

  get pagedSalidas() {
    const start = this.pageIndex * this.pageSize;
    return this.salidas.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cd.markForCheck();
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
      productos
    };

    this.salidaService.createSalida(data).subscribe({
      next: () => {
        this.dialog.open(AddSalidaSuccessComponent);
        this.salidas = [];
        this.router.navigate(['/almacenero/salida-almacenero']);
      },
      error: err => console.error(err)
    });
  }

  gestor() {
    this.router.navigate(['/almacenero/salida-almacenero']);
  }
}