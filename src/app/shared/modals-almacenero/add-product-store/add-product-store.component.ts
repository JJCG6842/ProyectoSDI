import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-product-store',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatInput, MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-product-store.component.html',
  styleUrl: './add-product-store.component.scss'
})
export class AddProductStoreComponent {

search(){

}


add(){
  
}

}
