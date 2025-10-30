import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'

@Component({
  selector: 'app-usuarios-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usuarios-administrador.component.html',
  styleUrl: './usuarios-administrador.component.scss'
})
export class UsuariosAdministradorComponent {

}
