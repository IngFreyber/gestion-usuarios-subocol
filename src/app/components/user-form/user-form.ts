import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit {

  form!: FormGroup

//  En las nuevas versines de Angular se usan las inyecciones de esta forma, tambien se puede seguir usando el constructor
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      name: [this.data?.name ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      city: [this.data?.city ?? '', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(){
    this.dialogRef.close();
  }
}
