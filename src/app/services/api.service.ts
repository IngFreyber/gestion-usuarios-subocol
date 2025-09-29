import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  private http = inject(HttpClient);

  getUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.baseUrl}/users`);
  }
}
