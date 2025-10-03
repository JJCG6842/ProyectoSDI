import { Component , inject, ChangeDetectionStrategy} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddSubcategoriaComponent } from '../../../shared/modals-almacenero/add-subcategoria/add-subcategoria.component';


@Component({
  selector: 'app-subcategoria-almacenero',
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcategoria-almacenero.component.html',
  styleUrl: './subcategoria-almacenero.component.scss'
})
export class SubcategoriaAlmaceneroComponent {

  readonly dialog = inject(MatDialog);

  constructor(private router: Router){}

  addSubcategory(){
    const dialogRef = this.dialog.open(AddSubcategoriaComponent, {
      width: '70%',
      panelClass:'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  } 

  page1(){
    this.router.navigate(['/almacenero/categoria-almacenero'])
  }
}
