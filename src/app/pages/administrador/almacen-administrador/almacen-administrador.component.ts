import { Component,inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule , MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-almacen-administrador',
  imports: [MatIconModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './almacen-administrador.component.html',
  styleUrl: './almacen-administrador.component.scss'
})
export class AlmacenAdministradorComponent {
  constructor(private router: Router,){}

  


  almacen(){
    this.router.navigate(['/administrador/almacenes-section-administrador'])
  }
}
