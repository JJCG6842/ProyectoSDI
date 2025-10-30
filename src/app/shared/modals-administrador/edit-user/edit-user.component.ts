import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  imports: [MatDialogModule, MatFormFieldModule, MatInput, MatButtonModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class editUserComponent {

  formUser!: FormGroup;

  constructor(private fb:FormBuilder,private dialog:MatDialog, private dialogRef: MatDialogRef<editUserComponent>){
    this.formUser = this.fb.group({
      name: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  get name(){
    return this.formUser.get('name') as FormControl;
  }

  get password(){
    return this.formUser.get('password') as FormControl;
  }


  editUser(){
    
  }

}
