import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddClienteComponent } from '../../../shared/modals-almacenero/add-cliente/add-cliente.component';
import { EditClienteComponent } from '../../../shared/modals-almacenero/add-cliente/modals-cliente/edit-cliente/edit-cliente.component';
import { DeleteClienteConfirmComponent } from '../../../shared/modals-almacenero/add-cliente/modals-cliente/delete-cliente-confirm/delete-cliente-confirm.component';
import { DeleteClienteSuccessComponent } from '../../../shared/modals-almacenero/add-cliente/modals-cliente/delete-cliente-success/delete-cliente-success.component';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../interface/cliente.interface';

@Component({
  selector: 'app-cliente-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule,MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cliente-administrador.component.html',
  styleUrl: './cliente-administrador.component.scss'
})
export class ClienteAdministradorComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  clientes: Cliente[] = [];
  paginatedClientes: Cliente[] = [];
  pageSize = 8;
  pageIndex = 0;
  isLoading = false;
  searchTerm: string = '';

  constructor(private clienteService: ClienteService){}

  ngOnInit(): void {
    this.obtenerClientes();
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
    this.paginatedClientes = this.clientes.slice(start, end);
    this.cd.markForCheck();
  }

  obtenerClientes(){
    this.clienteService.getClientes().subscribe({
      next: (res) => {
        this.clientes = res;
        this.pageIndex = 0;
        this.aplicarPaginacion();
        this.isLoading = false;
        console.log('Clientes cargados:', this.clientes);
        this.cd.markForCheck()
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.isLoading = false;
      }
    });
  }

  createCliente(){
      const dialogRef = this.dialog.open(AddClienteComponent, {
            width: '70%',
            panelClass:'custom-dialog-container'
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result){
              this.obtenerClientes();
            }
          });
    }

    editClient(cliente: Cliente){
    const dialogRef = this.dialog.open(EditClienteComponent, {
            width: '70%',
            panelClass:'custom-dialog-container',
            data: cliente
          });
          
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.obtenerClientes(); 
            }
        });
    }

    deleteCliente(id: string){
    const dialogRef = this.dialog.open(DeleteClienteConfirmComponent);
          
        dialogRef.afterClosed().subscribe(confirmado => {
          if(confirmado){
            this.clienteService.eliminarCliente(id).subscribe({
              next: () => {
                this.dialog.open(DeleteClienteSuccessComponent);
      
                this.obtenerClientes();
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
        this.obtenerClientes();
        return;
      }

      this.isLoading = true;

      this.clienteService.buscarCliente(term).subscribe({
        next: (res) => {
          this.clientes = res;
          this.pageIndex = 0;
          this.aplicarPaginacion();
          this.isLoading = false;
          this.cd.markForCheck();
        },
        error: (err) => {
          console.log('Error en la busqueda xd' , err);
          this.clientes = [];
          this.isLoading = false;
          this.cd.markForCheck();
        },
      })
    }

    onSearchTermChange(term: string) {
    this.searchTerm = term.trim();

    if (!this.searchTerm) {
      this.obtenerClientes();
    }
}

}
