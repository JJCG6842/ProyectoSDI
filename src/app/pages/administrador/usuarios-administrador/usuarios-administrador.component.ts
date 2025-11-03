import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddUserComponent } from '../../../shared/modals-administrador/add-user/add-user.component';
import { editUserComponent } from '../../../shared/modals-administrador/edit-user/edit-user.component';
import { DeleteUsuarioConfirmComponent } from '../../../shared/modals-administrador/modals/delete-usuario-confirm/delete-usuario-confirm.component';
import { Usuario } from '../../../interface/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { DeleteUsuarioSuccessComponent } from '../../../shared/modals-administrador/modals/delete-usuario-success/delete-usuario-success.component';

@Component({
  selector: 'app-usuarios-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usuarios-administrador.component.html',
  styleUrl: './usuarios-administrador.component.scss'
})
export class UsuariosAdministradorComponent implements OnInit{

  readonly dialog = inject(MatDialog);
  readonly cd = inject(ChangeDetectorRef);
  usuarios: Usuario[] = [];
  isLoading = false;
  searchTerm: string = '';

  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.obtenerUsers();
  }

  obtenerUsers(){
    this.usuarioService.getUsuario().subscribe({
      next:(res) =>{
        this.usuarios = res.filter(user => user.role === 'Almacenero');
        this.isLoading = false;
        console.log('Usuarios cargados:', this.usuarios);
        this.cd.markForCheck()
      },
      error: (err)=>{
        console.log('Error al obtener usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  ocultarPassword(password: string): string {
  return '*'.repeat(Math.min(password.length, 8));
}

  createUser(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.obtenerUsers();
      }
    });
  }

  editUser(usuario: Usuario){
    const dialogRef = this.dialog.open(editUserComponent, {
      width: '70%',
      panelClass:'custom-dialog-container',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.obtenerUsers();
      }
    });
  }

  deleteUser(id: string){
    const dialogRef = this.dialog.open(DeleteUsuarioConfirmComponent,{
      width: '400px',
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if(confirmado){
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            this.dialog.open(DeleteUsuarioSuccessComponent,{
              width: '400px',
              disableClose: true,
            });

            this.obtenerUsers();
          },
          error: (err) => {
            console.error('Error al eliminar el usuario', err);
          },
        });
      }
    });
  }

  search(){
    const term = this.searchTerm.trim();

    if(!term){
      this.obtenerUsers();
      return;
    }

    this.isLoading = true;

    this.usuarioService.buscarUsuario(term).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error:(err) => {
        console.error('Error en la busqueda :v', err);
        this.usuarios = [];
        this.isLoading = false;
        this.cd.markForCheck();
      }
    });
  }
  
}
