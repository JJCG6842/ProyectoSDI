import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddSupplierComponent } from '../../../shared/modals-administrador/add-supplier/add-supplier.component';
import { EditSupplierComponent } from '../../../shared/modals-administrador/edit-supplier/edit-supplier.component';
import { DeleteSupplierConfirmComponent } from '../../../shared/modals-administrador/modals/delete-supplier-confirm/delete-supplier-confirm.component';
import { Proveedor } from '../../../interface/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { DeleteSupplierSuccessComponent } from '../../../shared/modals-administrador/modals/delete-supplier-success/delete-supplier-success.component';


@Component({
  selector: 'app-proveedor-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-almacenero.component.html',
  styleUrl: './proveedor-almacenero.component.scss'
})
export class ProveedorAlmaceneroComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  proveedores: Proveedor[] = [];
  isLoading = false;
  searchTerm: string = '';

  constructor(private proveedorService: ProveedorService){}

  ngOnInit(): void {
      this.obtenerSuppliers();
  }


  obtenerSuppliers(){
    this.proveedorService.getProveedores().subscribe({
      next: (res) => {
        this.proveedores = res;
        this.isLoading = false;
        console.log('Proveedores cargados:', this.proveedores);
        this.cd.markForCheck()
      },
      error: (err) => {
        console.error('Error al obtener proveedores:', err);
        this.isLoading = false;
      }
    });
  }


  createSupplier(){
    const dialogRef = this.dialog.open(AddSupplierComponent, {
          width: '70%',
          panelClass:'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if(result){
            this.obtenerSuppliers();
          }
        });
  }

  editSupplier(proveedor: Proveedor){
    const dialogRef = this.dialog.open(EditSupplierComponent, {
          width: '70%',
          panelClass:'custom-dialog-container',
          data: proveedor
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.obtenerSuppliers(); 
          }
        });
  }

  deleteSupplier(id: string){
    const dialogRef = this.dialog.open(DeleteSupplierConfirmComponent);
    
        dialogRef.afterClosed().subscribe(confirmado => {
          if(confirmado){
            this.proveedorService.eliminarProveedor(id).subscribe({
              next: () => {
                this.dialog.open(DeleteSupplierSuccessComponent);

                this.obtenerSuppliers();
              },

              error: (err) => {
                console.log('Error al eliminar el proveedor', err)
              },
            });
          }
        });
  }

  search(){
    const term = this.searchTerm.trim();

    if(!term){
      this.obtenerSuppliers();
      return;
    }

    this.isLoading = true;

    this.proveedorService.buscarProveedor(term).subscribe({
      next: (res) => {
        this.proveedores = res;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.log('Error en la busqueda xd' , err);
        this.proveedores = [];
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  


  
}
