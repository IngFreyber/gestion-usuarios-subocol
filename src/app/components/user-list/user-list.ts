import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { UserForm } from '../user-form/user-form';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  formFilter!: FormGroup;
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns = ['id', 'name', 'email', 'city', 'actions'];
  pageSize = 10;
  pageIndex = 0;
  private apiService = inject(ApiService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private dialog: MatDialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.apiService.getUsers().subscribe(data => {
      this.users = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.address?.city || ''
      }));
      this.initForm();
      this.applyFilters();
      this.showToast('Usuarios cargados correctamente', 'success');
    });
    this.formFilter.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.applyFilters();
    });
  }

  initForm() {
    this.formFilter = this.fb.group({
      name: [''],
      email: [''],
      city: ['']
    });
  }

  applyFilters() {
    const { name, email, city } = this.formFilter.value;

    this.filteredUsers = this.users.filter(user =>
      (!name || this.normalizeText(user.name).includes(this.normalizeText(name))) &&
      (!email || this.normalizeText(user.email).includes(this.normalizeText(email))) &&
      (!city || this.normalizeText(user.city).includes(this.normalizeText(city)))
    );
}

private normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

  getPaginatedUsers(): User[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  add() {
    this.dialog.open(UserForm, { width: '400px', data: null })
      .afterClosed().subscribe((result: User) => {
        if (result) {
          result.id = Math.max(0, ...this.users.map(u => u.id)) + 1;
          this.users.push(result);
          this.applyFilters();
          this.showToast('Usuario creado exitosamente', 'success');
        }
      });
  }

  edit(user: User) {
    this.dialog.open(UserForm, { width: '400px', data: user })
      .afterClosed().subscribe((result: User) => {
        if (result) {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index > -1) {
            this.users[index] = { ...result, id: user.id };
            this.applyFilters();
            this.showToast('Usuario actualizado exitosamente', 'success');
          }
        }
      });
  }

  remove(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { name: user.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
        const totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(totalPages - 1, 0);
      }
        this.showToast('Usuario eliminado exitosamente', 'warning');
      }
    });
  }

  pageChange(event: any) {
    this.pageIndex = event.pageIndex;
  }

  clearFilters() {
    this.formFilter.reset();
  }

  private showToast(message: string, type: 'success' | 'warning' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [`toast-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
