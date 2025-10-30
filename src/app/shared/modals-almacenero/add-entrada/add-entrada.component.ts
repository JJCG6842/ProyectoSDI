import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-entrada',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-entrada.component.html',
  styleUrl: './add-entrada.component.scss'
})
export class AddEntradaComponent {
  formEntrance!:  FormGroup;

  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<AddEntradaComponent>, private dialog: MatDialog,){
    this.formEntrance = this.fb.group({
      product: ['',Validators.required],
      quantity: ['', Validators.required]
    })
  }

  get product(){
    return this.formEntrance.get('product') as FormControl;
  }

  get quantity(){
    return this.formEntrance.get('quantity') as FormControl;
  }



}
