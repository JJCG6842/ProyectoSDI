import { Component , inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-almacen-2-administrador',
  imports: [MatIconModule, MatDialogModule, MatButtonModule,CommonModule,FormsModule,MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-2-administrador.component.html',
  styleUrl: './almacen-2-administrador.component.scss'
})
export class Almacen2AdministradorComponent {

  constructor(private router: Router){}

  almacen1(){
    this.router.navigate(['/administrador/almacenes-administrador'])
  }
}
