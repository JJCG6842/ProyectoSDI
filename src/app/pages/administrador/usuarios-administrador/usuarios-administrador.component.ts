import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddUserComponent } from '../../../shared/modals-administrador/add-user/add-user.component';
import { editUserComponent } from '../../../shared/modals-administrador/edit-user/edit-user.component';
import { DeleteUserConfirmComponent } from '../../../shared/modals-administrador/delete-user/delete-user-confirm/delete-user-confirm.component';

@Component({
  selector: 'app-usuarios-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usuarios-administrador.component.html',
  styleUrl: './usuarios-administrador.component.scss'
})
export class UsuariosAdministradorComponent {

  readonly dialog = inject(MatDialog);

  createUser(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editUser(){
    const dialogRef = this.dialog.open(editUserComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteUser(){
    const dialogRef = this.dialog.open(DeleteUserConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
