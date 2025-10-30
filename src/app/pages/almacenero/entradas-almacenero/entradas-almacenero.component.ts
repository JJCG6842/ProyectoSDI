import { Component, ChangeDetectionStrategy,inject} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddEntradaComponent } from '../../../shared/modals-almacenero/add-entrada/add-entrada.component';
import { EraseEntradaConfirmComponent } from '../../../shared/modals-almacenero/add-entrada/modals-entrada/erase-entrada-confirm/erase-entrada-confirm.component';

@Component({
  selector: 'app-entradas-almacenero',
  imports: [MatExpansionModule,MatIconModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entradas-almacenero.component.html',
  styleUrl: './entradas-almacenero.component.scss'
})
export class EntradasAlmaceneroComponent {

  readonly dialog = inject(MatDialog)

  constructor(private router: Router){}

  addEntrance() {
      const dialogRef = this.dialog.open(AddEntradaComponent,{
        width: '550px',
        maxWidth: 'none',
        panelClass:'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }

  eraseEntrada(){
    const dialogRef = this.dialog.open(EraseEntradaConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }


  kardex(){
    this.router.navigate(['/almacenero/kardex-almacenero'])
  }

  salidas(){
    this.router.navigate(['/almacenero/salida-almacenero'])
  }
}
