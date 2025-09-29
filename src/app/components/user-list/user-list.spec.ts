import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserList } from './user-list';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA as MAT_MDC_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('UserList Component', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@test.com', city: 'Bogotá' },
    { id: 2, name: 'Jane Smith', email: 'jane@test.com', city: 'Medellín' },
    { id: 3, name: 'Carlos Pérez', email: 'carlos@test.com', city: 'Cali' }
  ];

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getUsers']);
    apiServiceMock.getUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [
        UserList,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTableModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User' } },
        { provide: MAT_MDC_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios desde el ApiService', () => {
    expect(apiServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(3);
    expect(component.filteredUsers.length).toBe(3);
  });

  it('debería filtrar por nombre', fakeAsync(() => {
    component.formFilter.controls['name'].setValue('John');
    tick();
    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  }));

  it('debería paginar correctamente', () => {
    component.pageSize = 2;
    component.applyFilters();
    component.pageIndex = 0;

    let page1 = component.getPaginatedUsers();
    expect(page1.length).toBe(2);

    component.pageIndex = 1;
    let page2 = component.getPaginatedUsers();
    expect(page2.length).toBe(1);
  });

  it('debería agregar un nuevo usuario', () => {
    const newUser: User = { id: 4, name: 'Nuevo', email: 'nuevo@test.com', city: 'Barranquilla' };
    component.users.push(newUser);
    component.applyFilters();

    expect(component.users.length).toBe(4);
    expect(component.filteredUsers.some(u => u.name === 'Nuevo')).toBeTrue();
  });

  it('debería eliminar un usuario y ajustar página si queda vacía', () => {
    component.pageSize = 2;
    component.applyFilters();

    component.pageIndex = 1;
    expect(component.getPaginatedUsers().length).toBe(1);

    const userToRemove = component.getPaginatedUsers()[0];
    component.users = component.users.filter(u => u.id !== userToRemove.id);
    component.applyFilters();

    const totalPages = Math.ceil(component.filteredUsers.length / component.pageSize);
    if (component.pageIndex >= totalPages) {
      component.pageIndex = Math.max(totalPages - 1, 0);
    }

    expect(component.pageIndex).toBe(0);
  });
});
