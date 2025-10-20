import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-producto',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule,MatInput,MatButtonModule,TextFieldModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './add-producto.component.html',
  styleUrl: './add-producto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductoComponent {

  formProduct!:  FormGroup;

  constructor(private fb:FormBuilder){
    this.formProduct = this.fb.group({
      partnumber: ['', Validators.required],
      name: ['', Validators.required],
      marca: ['', Validators.required],
      model: ['', Validators.required],
      image: [''],
      category: ['',Validators.required],
      subcategory: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  get partnumber(){
    return this.formProduct.get('partnumber') as FormControl;
  }

  get name(){
    return this.formProduct.get('name') as FormControl;
  }

  get marca(){
    return this.formProduct.get('marca') as FormControl;
  }

  get model(){
    return this.formProduct.get('model') as FormControl;
  }

  get image(){
    return this.formProduct.get('image') as FormControl;
  }

  get category(){
    return this.formProduct.get('category') as FormControl;
  }

  get subcategory(){
    return this.formProduct.get('subcategory') as FormControl;
  }

  get price(){
    return this.formProduct.get('price') as FormControl;
  }


  addProduct(){
    
  }
}
